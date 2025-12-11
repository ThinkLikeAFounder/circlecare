import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("CircleCare Circle Factory - Clarity 4 Tests", () => {

  describe("Circle Creation", () => {
    it("creates a circle with valid parameters using stacks-block-time", () => {
      const { result } = simnet.callPublicFn(
        "circle-factory",
        "create-circle",
        [Cl.stringAscii("Family Circle"), Cl.stringAscii("Alice")],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(1));
    });

    it("stores circle with stacks-block-time timestamp", () => {
      // Create circle
      simnet.callPublicFn(
        "circle-factory",
        "create-circle",
        [Cl.stringAscii("Test Circle"), Cl.stringAscii("Bob")],
        wallet1
      );

      // Get circle info - verify it exists
      const { result } = simnet.callReadOnlyFn(
        "circle-factory",
        "get-circle-info",
        [Cl.uint(1)],
        wallet1
      );

      // Circle should exist (not none)
      expect(result).not.toBeNone();
    });

    it("fails with empty name", () => {
      const { result } = simnet.callPublicFn(
        "circle-factory",
        "create-circle",
        [Cl.stringAscii(""), Cl.stringAscii("User")],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(101)); // ERR-INVALID-NAME
    });

    it("fails with empty nickname", () => {
      const { result } = simnet.callPublicFn(
        "circle-factory",
        "create-circle",
        [Cl.stringAscii("Circle"), Cl.stringAscii("")],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(102)); // ERR-INVALID-NICKNAME
    });

    it("increments circle ID correctly", () => {
      const result1 = simnet.callPublicFn(
        "circle-factory",
        "create-circle",
        [Cl.stringAscii("Circle 1"), Cl.stringAscii("User1")],
        wallet1
      );

      const result2 = simnet.callPublicFn(
        "circle-factory",
        "create-circle",
        [Cl.stringAscii("Circle 2"), Cl.stringAscii("User2")],
        wallet1
      );

      expect(result1.result).toBeOk(Cl.uint(1));
      expect(result2.result).toBeOk(Cl.uint(2));
    });
  });

  describe("Treasury Contract Verification with contract-hash?", () => {
    beforeEach(() => {
      // Create a circle first
      simnet.callPublicFn(
        "circle-factory",
        "create-circle",
        [Cl.stringAscii("Test Circle"), Cl.stringAscii("Creator")],
        wallet1
      );
    });

    it("rejects invalid contract principal", () => {
      const invalidPrincipal = wallet2; // Not a contract

      const { result } = simnet.callPublicFn(
        "circle-factory",
        "set-treasury-contract",
        [Cl.uint(1), Cl.principal(invalidPrincipal)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(108)); // ERR-INVALID-CONTRACT
    });

    it("only creator can attempt to set treasury", () => {
      const treasuryPrincipal = `${deployer}.circle-treasury`;

      const { result } = simnet.callPublicFn(
        "circle-factory",
        "set-treasury-contract",
        [Cl.uint(1), Cl.principal(treasuryPrincipal)],
        wallet2 // Not the creator
      );

      expect(result).toBeErr(Cl.uint(106)); // ERR-UNAUTHORIZED
    });

    // Note: Full treasury contract verification will be tested
    // in integration tests once circle-treasury is implemented (Issue #3)
  });

  describe("User Management", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "circle-factory",
        "create-circle",
        [Cl.stringAscii("Team Circle"), Cl.stringAscii("Admin")],
        wallet1
      );
    });

    it("adds user to circle", () => {
      const { result } = simnet.callPublicFn(
        "circle-factory",
        "add-user-to-circle",
        [Cl.principal(wallet2), Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("only creator can add users", () => {
      const { result } = simnet.callPublicFn(
        "circle-factory",
        "add-user-to-circle",
        [Cl.principal(wallet3), Cl.uint(1)],
        wallet2 // Not creator
      );

      expect(result).toBeErr(Cl.uint(106)); // ERR-UNAUTHORIZED
    });

    it("updates user circles list", () => {
      simnet.callPublicFn(
        "circle-factory",
        "add-user-to-circle",
        [Cl.principal(wallet2), Cl.uint(1)],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "circle-factory",
        "get-user-circles",
        [Cl.principal(wallet2)],
        wallet1
      );

      expect(result).toBeList([Cl.uint(1)]);
    });
  });

  describe("Circle Deactivation with stacks-block-time", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "circle-factory",
        "create-circle",
        [Cl.stringAscii("Temp Circle"), Cl.stringAscii("Owner")],
        wallet1
      );
    });

    it("creator can deactivate circle", () => {
      const { result } = simnet.callPublicFn(
        "circle-factory",
        "deactivate-circle",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("marks circle as inactive", () => {
      simnet.callPublicFn(
        "circle-factory",
        "deactivate-circle",
        [Cl.uint(1)],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "circle-factory",
        "is-circle-active",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeBool(false);
    });

    it("non-creator cannot deactivate", () => {
      const { result } = simnet.callPublicFn(
        "circle-factory",
        "deactivate-circle",
        [Cl.uint(1)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(106)); // ERR-UNAUTHORIZED
    });
  });

  describe("Read-Only Functions", () => {
    it("returns none for non-existent circle", () => {
      const { result } = simnet.callReadOnlyFn(
        "circle-factory",
        "get-circle-info",
        [Cl.uint(999)],
        wallet1
      );

      expect(result).toBeNone();
    });

    it("returns empty list for user with no circles", () => {
      const { result } = simnet.callReadOnlyFn(
        "circle-factory",
        "get-user-circles",
        [Cl.principal(wallet3)],
        wallet1
      );

      expect(result).toBeList([]);
    });

    it("returns correct creation fee", () => {
      const { result } = simnet.callReadOnlyFn(
        "circle-factory",
        "get-creation-fee",
        [],
        wallet1
      );

      expect(result).toBeUint(0);
    });

    it("returns correct next circle ID", () => {
      simnet.callPublicFn(
        "circle-factory",
        "create-circle",
        [Cl.stringAscii("Circle"), Cl.stringAscii("User")],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "circle-factory",
        "get-next-circle-id",
        [],
        wallet1
      );

      expect(result).toBeUint(2);
    });
  });

  describe("Admin Functions", () => {
    it("owner can set creation fee", () => {
      const { result } = simnet.callPublicFn(
        "circle-factory",
        "set-creation-fee",
        [Cl.uint(1000000)], // 1 STX
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("non-owner cannot set creation fee", () => {
      const { result } = simnet.callPublicFn(
        "circle-factory",
        "set-creation-fee",
        [Cl.uint(1000000)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(100)); // ERR-OWNER-ONLY
    });

    it("owner can set max circles per user", () => {
      const { result } = simnet.callPublicFn(
        "circle-factory",
        "set-max-circles-per-user",
        [Cl.uint(20)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("validates max circles range", () => {
      const { result } = simnet.callPublicFn(
        "circle-factory",
        "set-max-circles-per-user",
        [Cl.uint(0)], // Invalid: must be > 0
        deployer
      );

      expect(result).toBeErr(Cl.uint(101)); // ERR-INVALID-NAME (reused)
    });
  });

  describe("Integration Tests", () => {
    it("complete circle lifecycle without treasury", () => {
      // Create circle
      const createResult = simnet.callPublicFn(
        "circle-factory",
        "create-circle",
        [Cl.stringAscii("Complete Circle"), Cl.stringAscii("Founder")],
        wallet1
      );
      expect(createResult.result).toBeOk(Cl.uint(1));

      // Add users
      simnet.callPublicFn(
        "circle-factory",
        "add-user-to-circle",
        [Cl.principal(wallet2), Cl.uint(1)],
        wallet1
      );

      // Verify circle stats returns ok
      const statsResult = simnet.callReadOnlyFn(
        "circle-factory",
        "get-circle-stats",
        [Cl.uint(1)],
        wallet1
      );

      // Stats should return successfully
      expect(statsResult.result).not.toBeErr();
    });
  });
});
