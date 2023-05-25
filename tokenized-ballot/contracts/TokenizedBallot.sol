// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
/// @title Voting with delegation.

interface IMyVoteToken{
    function getPastVotes(address, uint256) external view returns (uint256);
}
contract TokenizedBallot {

    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name;  
        uint voteCount; 
    }

    IMyVoteToken public tokenContract;
    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;
    uint256 targetBlockNumber;

    mapping(address => uint256) public votingPowerSpent;

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(
        bytes32[] memory proposalNames, 
        address _tokenContract, 
        uint256 _targetBlockNumber
    ) {
        tokenContract = IMyVoteToken( _tokenContract);
        targetBlockNumber = _targetBlockNumber;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function vote(uint256 proposal, uint256 amount) external {
        require(votingPower(msg.sender) >= amount, "TokenizedBallot: trying to vote more than allowed"); /// have voting power at block number
        //TODO account voting  power
        // update vote for  the proposal
        votingPowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount +=amount;

    }

    function votingPower(address account) public view returns (uint256){
        return tokenContract.getPastVotes(account, targetBlockNumber) - votingPowerSpent[account];

    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}