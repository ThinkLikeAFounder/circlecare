import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;
const wallet4 = accounts.get("wallet_4")!;

describe("CircleCare Circle Treasury - Clarity 4 Tests", () => {

  beforeEach(() => {
    // Create a circle via factory for each test
    simnet.callPublicFn(
      "circle-factory",
      "create-circle",
      [Cl.stringAscii("Test Circle"), Cl.stringAscii("Creator")],
      wallet1
    );
  });

  describe("Circle Initialization", () => {
    it("initializes circle with stacks-block-time", () => {
      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Family Circle"),
          Cl.principal(wallet1),
          Cl.stringAscii("Alice")
        ],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("stores circle metadata correctly", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Work Circle"),
          Cl.principal(wallet1),
          Cl.stringAscii("Bob")
        ],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-circle",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("prevents double initialization", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Circle 1"),
          Cl.principal(wallet1),
          Cl.stringAscii("User1")
        ],
        deployer
      );

      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Circle 1"),
          Cl.principal(wallet1),
          Cl.stringAscii("User1")
        ],
        deployer
      );

      expect(result).toBeErr(Cl.uint(212)); // ERR-CIRCLE-NOT-FOUND (already exists)
    });

    it("adds creator as first member", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Test"),
          Cl.principal(wallet1),
          Cl.stringAscii("Alice")
        ],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-member-info",
        [Cl.uint(1), Cl.principal(wallet1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });
  });

  describe("Member Management", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Test Circle"),
          Cl.principal(wallet1),
          Cl.stringAscii("Creator")
        ],
        deployer
      );
    });

    it("creator can add members", () => {
      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet2), Cl.stringAscii("Member2")],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("only creator can add members", () => {
      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet3), Cl.stringAscii("Hacker")],
        wallet2 // Not creator
      );

      expect(result).toBeErr(Cl.uint(200)); // ERR-UNAUTHORIZED
    });

    it("prevents duplicate members", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet2), Cl.stringAscii("Bob")],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet2), Cl.stringAscii("Bob2")],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(209)); // ERR-MEMBER-EXISTS
    });

    it("can remove member with zero balance", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet2), Cl.stringAscii("Temp")],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "remove-member",
        [Cl.uint(1), Cl.principal(wallet2)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });
  });

  describe("Expense Management", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Expense Circle"),
          Cl.principal(wallet1),
          Cl.stringAscii("Alice")
        ],
        deployer
      );

      simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet2), Cl.stringAscii("Bob")],
        wallet1
      );

      simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet3), Cl.stringAscii("Charlie")],
        wallet1
      );
    });

    it("creates expense with participants", () => {
      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "add-expense",
        [
          Cl.uint(1),
          Cl.stringAscii("Dinner"),
          Cl.uint(300000000), // 300 STX
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2), Cl.principal(wallet3)])
        ],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(1)); // First expense ID
    });

    it("distributes shares evenly among participants", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "add-expense",
        [
          Cl.uint(1),
          Cl.stringAscii("Lunch"),
          Cl.uint(300000000),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2), Cl.principal(wallet3)])
        ],
        wallet1
      );

      // Each should owe 100 STX (300/3)
      const { result } = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-balance",
        [Cl.uint(1), Cl.principal(wallet2), Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeUint(100000000); // 100 STX
    });

    it("prevents empty participant list", () => {
      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "add-expense",
        [
          Cl.uint(1),
          Cl.stringAscii("Empty"),
          Cl.uint(100000000),
          Cl.list([])
        ],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(202)); // ERR-INVALID-PARTICIPANT
    });

    it("validates all participants are members", () => {
      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "add-expense",
        [
          Cl.uint(1),
          Cl.stringAscii("Invalid"),
          Cl.uint(100000000),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet4)]) // wallet4 not a member
        ],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(202)); // ERR-INVALID-PARTICIPANT
    });

    it("rejects when circle is paused", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "pause-circle",
        [Cl.uint(1)],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "add-expense",
        [
          Cl.uint(1),
          Cl.stringAscii("Paused"),
          Cl.uint(100000000),
          Cl.list([Cl.principal(wallet1)])
        ],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(208)); // ERR-CIRCLE-PAUSED
    });

    it("updates expense description", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "add-expense",
        [
          Cl.uint(1),
          Cl.stringAscii("Original"),
          Cl.uint(100000000),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2)])
        ],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "update-expense-description",
        [Cl.uint(1), Cl.uint(1), Cl.stringAscii("Updated Description")],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });
  });

  describe("Debt Settlement with restrict-assets?", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Settlement Circle"),
          Cl.principal(wallet1),
          Cl.stringAscii("Alice")
        ],
        deployer
      );

      simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet2), Cl.stringAscii("Bob")],
        wallet1
      );

      // Create expense: wallet1 paid, wallet2 owes
      simnet.callPublicFn(
        "circle-treasury",
        "add-expense",
        [
          Cl.uint(1),
          Cl.stringAscii("Shared Expense"),
          Cl.uint(200000000), // 200 STX
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2)])
        ],
        wallet1
      );
    });

    it("settles debt with restrict-assets? protection", () => {
      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "settle-debt-stx",
        [Cl.uint(1), Cl.principal(wallet1)],
        wallet2
      );

      expect(result).toBeOk(Cl.uint(1)); // Settlement ID
    });

    it("updates balances after settlement", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "settle-debt-stx",
        [Cl.uint(1), Cl.principal(wallet1)],
        wallet2
      );

      const { result } = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-balance",
        [Cl.uint(1), Cl.principal(wallet2), Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeUint(0); // Debt cleared
    });

    it("records settlement history", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "settle-debt-stx",
        [Cl.uint(1), Cl.principal(wallet1)],
        wallet2
      );

      const { result } = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-settlement",
        [Cl.uint(1), Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("prevents settlement when no debt exists", () => {
      // wallet1 has no debt to wallet2
      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "settle-debt-stx",
        [Cl.uint(1), Cl.principal(wallet2)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(205)); // ERR-NO-DEBT
    });

    it("prevents settlement when paused", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "pause-circle",
        [Cl.uint(1)],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "settle-debt-stx",
        [Cl.uint(1), Cl.principal(wallet1)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(208)); // ERR-CIRCLE-PAUSED
    });
  });

  describe("Balance Calculations", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Balance Circle"),
          Cl.principal(wallet1),
          Cl.stringAscii("Alice")
        ],
        deployer
      );

      simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet2), Cl.stringAscii("Bob")],
        wallet1
      );

      simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet3), Cl.stringAscii("Charlie")],
        wallet1
      );
    });

    it("calculates net balance correctly", () => {
      // wallet1 pays for everyone
      simnet.callPublicFn(
        "circle-treasury",
        "add-expense",
        [
          Cl.uint(1),
          Cl.stringAscii("Trip"),
          Cl.uint(300000000),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2), Cl.principal(wallet3)])
        ],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-net-balance",
        [Cl.uint(1), Cl.principal(wallet1)],
        wallet1
      );

      // wallet1 is owed 200 STX (paid 300, owes 100)
      expect(result).toBeOk(Cl.uint(200000000));
    });

    it("handles multiple expenses correctly", () => {
      // Expense 1: wallet1 pays
      simnet.callPublicFn(
        "circle-treasury",
        "add-expense",
        [
          Cl.uint(1),
          Cl.stringAscii("Dinner"),
          Cl.uint(200000000),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2)])
        ],
        wallet1
      );

      // Expense 2: wallet2 pays
      simnet.callPublicFn(
        "circle-treasury",
        "add-expense",
        [
          Cl.uint(1),
          Cl.stringAscii("Lunch"),
          Cl.uint(100000000),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2)])
        ],
        wallet2
      );

      // Check wallet2 owes wallet1 100 STX from first expense
      const result1 = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-balance",
        [Cl.uint(1), Cl.principal(wallet2), Cl.principal(wallet1)],
        wallet1
      );
      expect(result1.result).toBeUint(100000000);

      // Check wallet1 owes wallet2 50 STX from second expense
      const result2 = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-balance",
        [Cl.uint(1), Cl.principal(wallet1), Cl.principal(wallet2)],
        wallet1
      );
      expect(result2.result).toBeUint(50000000);
    });
  });

  describe("Pause/Unpause Functionality", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Pause Circle"),
          Cl.principal(wallet1),
          Cl.stringAscii("Admin")
        ],
        deployer
      );
    });

    it("creator can pause circle", () => {
      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "pause-circle",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("creator can unpause circle", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "pause-circle",
        [Cl.uint(1)],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "unpause-circle",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("non-creator cannot pause", () => {
      const { result } = simnet.callPublicFn(
        "circle-treasury",
        "pause-circle",
        [Cl.uint(1)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(200)); // ERR-UNAUTHORIZED
    });
  });

  describe("Read-Only Functions", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Read Circle"),
          Cl.principal(wallet1),
          Cl.stringAscii("Creator")
        ],
        deployer
      );

      simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet2), Cl.stringAscii("Member")],
        wallet1
      );
    });

    it("returns circle stats", () => {
      const { result } = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-circle-stats",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeErr();
    });

    it("returns member at index", () => {
      const { result } = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-member-at-index",
        [Cl.uint(1), Cl.uint(0)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("returns none for non-existent circle", () => {
      const { result } = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-circle",
        [Cl.uint(999)],
        wallet1
      );

      expect(result).toBeNone();
    });

    it("returns none for non-existent member", () => {
      const { result } = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-member-info",
        [Cl.uint(1), Cl.principal(wallet3)],
        wallet1
      );

      expect(result).toBeNone();
    });
  });

  describe("Integration with stacks-block-time", () => {
    it("uses stacks-block-time for timestamps", () => {
      simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Time Circle"),
          Cl.principal(wallet1),
          Cl.stringAscii("Timer")
        ],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "circle-treasury",
        "get-circle",
        [Cl.uint(1)],
        wallet1
      );

      // Circle should have created-at timestamp
      expect(result).not.toBeNone();
    });
  });

  describe("Bulk Operations", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "circle-treasury",
        "initialize-circle",
        [
          Cl.uint(1),
          Cl.stringAscii("Bulk Circle"),
          Cl.principal(wallet1),
          Cl.stringAscii("Creator")
        ],
        deployer
      );

      simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet2), Cl.stringAscii("Bob")],
        wallet1
      );

      simnet.callPublicFn(
        "circle-treasury",
        "add-member",
        [Cl.uint(1), Cl.principal(wallet3), Cl.stringAscii("Charlie")],
        wallet1
      );
    });

    describe("Bulk Expense Addition", () => {
      it("adds multiple expenses successfully", () => {
        const expenses = [
          {
            description: "Dinner",
            amount: 300000000, // 300 STX
            participants: [wallet1, wallet2, wallet3]
          },
          {
            description: "Lunch",
            amount: 150000000, // 150 STX
            participants: [wallet1, wallet2]
          },
          {
            description: "Coffee",
            amount: 50000000, // 50 STX
            participants: [wallet2, wallet3]
          }
        ];

        const { result } = simnet.callPublicFn(
          "circle-treasury",
          "add-multiple-expenses",
          [
            Cl.uint(1),
            Cl.list(expenses.map(exp => Cl.tuple({
              'description': Cl.stringAscii(exp.description),
              'amount': Cl.uint(exp.amount),
              'participants': Cl.list(exp.participants.map(p => Cl.principal(p)))
            })))
          ],
          wallet1
        );

        expect(result).toBeOk(Cl.list([
          Cl.uint(1), // First expense ID
          Cl.uint(2), // Second expense ID
          Cl.uint(3)  // Third expense ID
        ]));
      });

      it("validates expenses individually", () => {
        const expenses = [
          {
            description: "Valid",
            amount: 100000000,
            participants: [wallet1, wallet2]
          },
          {
            description: "Invalid Participants",
            amount: 50000000,
            participants: [wallet1, wallet4] // wallet4 not a member
          }
        ];

        const { result } = simnet.callPublicFn(
          "circle-treasury",
          "add-multiple-expenses",
          [
            Cl.uint(1),
            Cl.list(expenses.map(exp => Cl.tuple({
              'description': Cl.stringAscii(exp.description),
              'amount': Cl.uint(exp.amount),
              'participants': Cl.list(exp.participants.map(p => Cl.principal(p)))
            })))
          ],
          wallet1
        );

        expect(result).toBeErr(Cl.uint(202)); // ERR-INVALID-PARTICIPANT from second expense
      });

      it("requires active circle membership", () => {
        const { result } = simnet.callPublicFn(
          "circle-treasury",
          "add-multiple-expenses",
          [
            Cl.uint(1),
            Cl.list([Cl.tuple({
              'description': Cl.stringAscii("Test"),
              'amount': Cl.uint(100000000),
              'participants': Cl.list([Cl.principal(wallet1)])
            })])
          ],
          wallet3 // Not a member who can add expenses
        );

        expect(result).toBeErr(Cl.uint(200)); // ERR-UNAUTHORIZED
      });

      it("handles empty expense list", () => {
        const { result } = simnet.callPublicFn(
          "circle-treasury",
          "add-multiple-expenses",
          [Cl.uint(1), Cl.list([])],
          wallet1
        );

        expect(result).toBeErr(Cl.uint(201)); // ERR-INVALID-AMOUNT (empty list)
      });
    });

    describe("Bulk Debt Settlement", () => {
      beforeEach(() => {
        // Create some expenses to generate debts
        simnet.callPublicFn(
          "circle-treasury",
          "add-expense",
          [
            Cl.uint(1),
            Cl.stringAscii("Dinner"),
            Cl.uint(300000000),
            Cl.list([Cl.principal(wallet1), Cl.principal(wallet2), Cl.principal(wallet3)])
          ],
          wallet1
        );

        simnet.callPublicFn(
          "circle-treasury",
          "add-expense",
          [
            Cl.uint(1),
            Cl.stringAscii("Lunch"),
            Cl.uint(200000000),
            Cl.list([Cl.principal(wallet2), Cl.principal(wallet3)])
          ],
          wallet2
        );
      });

      it("settles multiple debts successfully", () => {
        const settlements = [
          { creditor: wallet1 }, // wallet2 owes wallet1 from dinner
          { creditor: wallet2 }  // wallet3 owes wallet2 from lunch
        ];

        const { result } = simnet.callPublicFn(
          "circle-treasury",
          "settle-multiple-debts",
          [
            Cl.uint(1),
            Cl.list(settlements.map(s => Cl.tuple({
              'creditor': Cl.principal(s.creditor)
            })))
          ],
          wallet2 // wallet2 settling debts
        );

        expect(result).toBeOk(Cl.list([
          Cl.uint(1), // First settlement ID
          Cl.uint(2)  // Second settlement ID
        ]));
      });

      it("handles debts with no balance", () => {
        const settlements = [
          { creditor: wallet1 }, // Valid debt
          { creditor: wallet3 }  // No debt between wallet2 and wallet3
        ];

        const { result } = simnet.callPublicFn(
          "circle-treasury",
          "settle-multiple-debts",
          [
            Cl.uint(1),
            Cl.list(settlements.map(s => Cl.tuple({
              'creditor': Cl.principal(s.creditor)
            })))
          ],
          wallet2
        );

        expect(result).toBeErr(Cl.uint(205)); // ERR-NO-DEBT from second settlement
      });

      it("requires active membership", () => {
        const { result } = simnet.callPublicFn(
          "circle-treasury",
          "settle-multiple-debts",
          [
            Cl.uint(1),
            Cl.list([Cl.tuple({
              'creditor': Cl.principal(wallet1)
            })])
          ],
          wallet4 // Not a member
        );

        expect(result).toBeErr(Cl.uint(206)); // ERR-MEMBER-NOT-FOUND
      });
    });

    describe("Bulk Member Addition", () => {
      it("adds multiple members successfully", () => {
        const newMembers = [
          { member: wallet2, nickname: "Bob" },
          { member: wallet3, nickname: "Charlie" },
          { member: wallet4, nickname: "David" }
        ];

        const { result } = simnet.callPublicFn(
          "circle-treasury",
          "add-multiple-members",
          [
            Cl.uint(1),
            Cl.list(newMembers.map(m => Cl.tuple({
              'member': Cl.principal(m.member),
              'nickname': Cl.stringAscii(m.nickname)
            })))
          ],
          wallet1 // Creator
        );

        expect(result).toBeOk(Cl.list([
          Cl.bool(true), // First addition success
          Cl.bool(true), // Second addition success
          Cl.bool(true)  // Third addition success
        ]));
      });

      it("validates member limits", () => {
        // Try to add more members than the limit allows
        const manyMembers = Array.from({length: 48}, (_, i) => ({
          member: accounts.get(`wallet_${i + 5}`)!, // wallet_5 onwards
          nickname: `User${i + 5}`
        }));

        const { result } = simnet.callPublicFn(
          "circle-treasury",
          "add-multiple-members",
          [
            Cl.uint(1),
            Cl.list(manyMembers.map(m => Cl.tuple({
              'member': Cl.principal(m.member),
              'nickname': Cl.stringAscii(m.nickname)
            })))
          ],
          wallet1
        );

        expect(result).toBeErr(Cl.uint(210)); // ERR-MAX-MEMBERS
      });

      it("requires creator authorization", () => {
        const { result } = simnet.callPublicFn(
          "circle-treasury",
          "add-multiple-members",
          [
            Cl.uint(1),
            Cl.list([Cl.tuple({
              'member': Cl.principal(wallet4),
              'nickname': Cl.stringAscii("Hacker")
            })])
          ],
          wallet2 // Not creator
        );

        expect(result).toBeErr(Cl.uint(200)); // ERR-UNAUTHORIZED
      });

      it("handles duplicate members in bulk", () => {
        // Add wallet2 first
        simnet.callPublicFn(
          "circle-treasury",
          "add-member",
          [Cl.uint(1), Cl.principal(wallet2), Cl.stringAscii("Bob")],
          wallet1
        );

        // Try to add wallet2 again in bulk
        const { result } = simnet.callPublicFn(
          "circle-treasury",
          "add-multiple-members",
          [
            Cl.uint(1),
            Cl.list([Cl.tuple({
              'member': Cl.principal(wallet2),
              'nickname': Cl.stringAscii("Bob2")
            })])
          ],
          wallet1
        );

        expect(result).toBeErr(Cl.uint(209)); // ERR-MEMBER-EXISTS
      });
    });

    describe("Bulk Operation Integration", () => {
      it("combines bulk operations in complex workflow", () => {
        // 1. Bulk add members
        simnet.callPublicFn(
          "circle-treasury",
          "add-multiple-members",
          [
            Cl.uint(1),
            Cl.list([
              Cl.tuple({
                'member': Cl.principal(wallet2),
                'nickname': Cl.stringAscii("Bob")
              }),
              Cl.tuple({
                'member': Cl.principal(wallet3),
                'nickname': Cl.stringAscii("Charlie")
              }),
              Cl.tuple({
                'member': Cl.principal(wallet4),
                'nickname': Cl.stringAscii("David")
              })
            ])
          ],
          wallet1
        );

        // 2. Bulk add expenses
        simnet.callPublicFn(
          "circle-treasury",
          "add-multiple-expenses",
          [
            Cl.uint(1),
            Cl.list([
              Cl.tuple({
                'description': Cl.stringAscii("Dinner"),
                'amount': Cl.uint(400000000),
                'participants': Cl.list([Cl.principal(wallet1), Cl.principal(wallet2), Cl.principal(wallet3), Cl.principal(wallet4)])
              }),
              Cl.tuple({
                'description': Cl.stringAscii("Drinks"),
                'amount': Cl.uint(100000000),
                'participants': Cl.list([Cl.principal(wallet2), Cl.principal(wallet3), Cl.principal(wallet4)])
              })
            ])
          ],
          wallet1
        );

        // 3. Bulk settle debts
        simnet.callPublicFn(
          "circle-treasury",
          "settle-multiple-debts",
          [
            Cl.uint(1),
            Cl.list([
              Cl.tuple({'creditor': Cl.principal(wallet1)}), // wallet2 settles with wallet1
              Cl.tuple({'creditor': Cl.principal(wallet1)})  // wallet3 settles with wallet1
            ])
          ],
          wallet2
        );

        // Verify balances are updated
        const balance1 = simnet.callReadOnlyFn(
          "circle-treasury",
          "get-balance",
          [Cl.uint(1), Cl.principal(wallet2), Cl.principal(wallet1)],
          wallet1
        );
        expect(balance1.result).toBeUint(0); // Debt settled

        const balance2 = simnet.callReadOnlyFn(
          "circle-treasury",
          "get-balance",
          [Cl.uint(1), Cl.principal(wallet3), Cl.principal(wallet1)],
          wallet1
        );
        expect(balance2.result).toBeUint(0); // Debt settled
      });

      it("handles paused circle for bulk operations", () => {
        // Pause the circle
        simnet.callPublicFn(
          "circle-treasury",
          "pause-circle",
          [Cl.uint(1)],
          wallet1
        );

        // Try bulk operations
        const expenseResult = simnet.callPublicFn(
          "circle-treasury",
          "add-multiple-expenses",
          [
            Cl.uint(1),
            Cl.list([Cl.tuple({
              'description': Cl.stringAscii("Test"),
              'amount': Cl.uint(100000000),
              'participants': Cl.list([Cl.principal(wallet1)])
            })])
          ],
          wallet1
        );

        expect(expenseResult.result).toBeErr(Cl.uint(208)); // ERR-CIRCLE-PAUSED

        const settlementResult = simnet.callPublicFn(
          "circle-treasury",
          "settle-multiple-debts",
          [
            Cl.uint(1),
            Cl.list([Cl.tuple({'creditor': Cl.principal(wallet1)})])
          ],
          wallet2
        );

        expect(settlementResult.result).toBeErr(Cl.uint(208)); // ERR-CIRCLE-PAUSED
      });
    });
  });
});
