import { render, screen } from '@testing-library/react';
import { ClarityShowcase } from '../ClarityShowcase';
import { CodeBracketIcon, LockClosedIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

describe('ClarityShowcase', () => {
  it('renders the component with all features', () => {
    render(<ClarityShowcase />);
    
    // Check the main heading
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Powered by Clarity 4');
    
    // Check the subtitle
    expect(screen.getByText('CircleCare leverages the security and flexibility of Clarity 4 for smart contract execution.')).toBeInTheDocument();
    
    // Check feature cards
    const featureNames = [
      'contract-hash?',
      'restrict-assets?',
      'stacks-block-time',
      'to-ascii?',
      'Contract Verification'
    ];
    
    featureNames.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
    
    // Check the security section
    expect(screen.getByText('Smart Contract Security')).toBeInTheDocument();
    expect(screen.getByText('View smart contract documentation →')).toBeInTheDocument();
  });
  
  it('renders the correct number of feature cards', () => {
    render(<ClarityShowcase />);
    const featureIcons = screen.getAllByRole('img', { hidden: true });
    // 5 features + 1 icon in the security section = 6 icons
    expect(featureIcons.length).toBe(6);
  });
  
  it('displays the correct icon for each feature', () => {
    render(<ClarityShowcase />);
    
    // Check for specific icons
    const lockIcons = document.getElementsByClassName('h-6 w-6');
    // There should be 3 lock icons (2 for features + 1 in security section)
    expect(lockIcons.length).toBe(3);
  });
  
  it('has a link to the documentation', () => {
    render(<ClarityShowcase />);
    const docLink = screen.getByText('View smart contract documentation →');
    expect(docLink).toHaveAttribute('href', '#');
    expect(docLink).toHaveClass('text-indigo-600');
  });
});
