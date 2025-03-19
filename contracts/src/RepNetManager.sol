// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./DataTypes.sol";

import "./ERC20Factory.sol";
import "./ModelTokenERC20.sol";
import "./interfaces/IModelTokenERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RepNetManager
 * @author Replicant Network Team
 * @notice Main contract for managing AI model crowdfunding campaigns
 * @dev Handles the entire lifecycle of crowdfunding campaigns, including creation, funding, submission, voting, and finalization
 */
contract RepNetManager is Ownable, ReentrancyGuard {

    uint256 public constant MAX_DEVELOPER_FEE_PERCENTAGE = 5000; // 50%
    uint256 public constant MIN_FUNDING_PHASE_DURATION = 5 minutes; // change to at least 5 minutes
    uint256 public constant MIN_SUBMISSION_PHASE_DURATION = 5 minutes; // change to at least 5 minutes
    uint256 public constant MIN_VOTING_PHASE_DURATION = 5 minutes; // change to at least 5 minutes
    uint256 public constant MIN_VOTES_POWER_PERCENTAGE = 2000; // 20%
    uint256 public constant CONVERSION_RATE = 1_000_000; // 1 eth = 1_000_000 tokens, following the ConstitutionDAO approach
    uint256 public crowdfundingId;
    ERC20Factory public erc20Factory;

    mapping(uint256 => Crowdfunding) private crowdfundings;

    /**
     * @notice Modifier to check if a crowdfunding exists
     * @param _crowdfundingId The ID of the crowdfunding to check
     */
    modifier crowdfundingExists(
        uint256 _crowdfundingId
    ) {
        if (!_crowdfundingExists(_crowdfundingId)) {
            revert CrowdfundingNotFound();
        }
        _;
    }

    /**
     * @notice Constructor initializes the contract and creates a new ERC20Factory
     * @dev Sets the contract owner and initializes the ERC20Factory
     */
    constructor() Ownable(msg.sender) {
        erc20Factory = new ERC20Factory();
    }

    // Public methods

    /**
     * @notice Creates a new crowdfunding campaign
     * @dev Validates parameters, creates the crowdfunding, and funds it with the initial amount
     * @param _params The parameters for creating the crowdfunding
     * @return id The ID of the created crowdfunding
     * @custom:throws InitialFundingRequired if msg.value is 0
     * @custom:throws InitialFundingExceedsCap if msg.value exceeds the raise cap
     * @custom:throws DeveloperFeePercentageTooHigh if the developer fee percentage is too high
     */
    function createCrowdfunding(
        CrowdfundingCreationParams memory _params
    ) public payable nonReentrant returns (uint256) {
        if (msg.value == 0) {
            revert InitialFundingRequired();
        }
        if (_params.raiseCap > 0 && msg.value > _params.raiseCap) {
            revert InitialFundingExceedsCap(msg.value, _params.raiseCap);
        }
        if (_params.developerFeePercentage > MAX_DEVELOPER_FEE_PERCENTAGE) {
            revert DeveloperFeePercentageTooHigh(_params.developerFeePercentage);
        }
        _validateTimestamps(_params.fundingPhaseEnd, _params.submissionPhaseEnd, _params.votingPhaseEnd);
        uint256 newCrowdfundingId = crowdfundingId;
        _createCrowdfunding(_params);
        _fund(newCrowdfundingId);
        return newCrowdfundingId;
    }

    /**
     * @notice Funds an existing crowdfunding campaign
     * @dev Validates the funding amount and phase, then adds the funds to the crowdfunding
     * @param _crowdfundingId The ID of the crowdfunding to fund
     * @custom:throws NotInFundingPhase if the crowdfunding is not in the funding phase
     * @custom:throws FundingCapReached if the funding would exceed the raise cap
     * @custom:throws RequestedFundingZero if msg.value is 0
     */
    function fund(
        uint256 _crowdfundingId
    ) public payable crowdfundingExists(_crowdfundingId) nonReentrant {
        if (_currentPhase(_crowdfundingId) != CrowdfundingPhase.Funding) {
            revert NotInFundingPhase();
        }
        if (
            crowdfundings[_crowdfundingId].raiseCap > 0
                && msg.value > crowdfundings[_crowdfundingId].raiseCap - crowdfundings[_crowdfundingId].amountRaised
        ) {
            revert FundingCapReached(msg.value, crowdfundings[_crowdfundingId].raiseCap);
        }
        if (msg.value == 0) {
            revert RequestedFundingZero();
        }
        _fund(_crowdfundingId);
    }

    /**
     * @notice Submits a solution to a crowdfunding campaign
     * @dev Only the contract owner can submit solutions, and only during the submission phase
     * @param _crowdfundingId The ID of the crowdfunding to submit to
     * @param _hash The hash of the solution
     * @param _creator The address of the solution creator
     * @custom:throws NotInSubmissionPhase if the crowdfunding is not in the submission phase
     * @custom:throws SolutionAlreadySubmitted if the solution has already been submitted
     */
    function submit(
        uint256 _crowdfundingId,
        bytes32 _hash,
        address _creator
    ) public crowdfundingExists(_crowdfundingId) onlyOwner {
        if (_currentPhase(_crowdfundingId) != CrowdfundingPhase.Submission) {
            revert NotInSubmissionPhase();
        }
        if (crowdfundings[_crowdfundingId].submissions[_hash].creator != address(0)) {
            revert SolutionAlreadySubmitted(_hash);
        }
        _submit(_crowdfundingId, _hash, _creator);
    }

    /**
     * @notice Votes for a solution in a crowdfunding campaign
     * @dev Users can only vote once, cannot vote for their own submissions, and must have tokens
     * @param _crowdfundingId The ID of the crowdfunding to vote in
     * @param _submissionId The ID of the submission to vote for
     * @custom:throws NotInVotingPhase if the crowdfunding is not in the voting phase
     * @custom:throws SubmissionNotFound if the submission does not exist
     * @custom:throws AlreadyVoted if the user has already voted
     * @custom:throws CannotVoteForYourOwnSubmission if the user tries to vote for their own submission
     * @custom:throws VotingBalanceZero if the user has no tokens
     */
    function vote(
        uint256 _crowdfundingId,
        bytes32 _submissionId
    ) public crowdfundingExists(_crowdfundingId) nonReentrant {
        if (_currentPhase(_crowdfundingId) != CrowdfundingPhase.Voting) {
            revert NotInVotingPhase();
        }
        if (crowdfundings[_crowdfundingId].submissions[_submissionId].creator == address(0)) {
            revert SubmissionNotFound(_submissionId);
        }
        if (_hasVoted(_crowdfundingId, msg.sender)) {
            revert AlreadyVoted(_submissionId);
        }
        // check if user has deposited
        if (!_hasDeposited(_crowdfundingId, msg.sender)) {
            revert NoDeposits();
        }
        if (crowdfundings[_crowdfundingId].submissions[_submissionId].creator == msg.sender) {
            revert CannotVoteForYourOwnSubmission(_submissionId);
        }
        _vote(_crowdfundingId, _submissionId);
    }

    /**
     * @notice Finalizes a crowdfunding campaign
     * @dev Can only be called when the crowdfunding is no longer active and not already finalized
     * @param _crowdfundingId The ID of the crowdfunding to finalize
     * @custom:throws CrowdfundingStillActive if the crowdfunding is still active
     * @custom:throws CrowdfundingAlreadyFinalized if the crowdfunding is already finalized
     */
    function finalize(
        uint256 _crowdfundingId
    ) public crowdfundingExists(_crowdfundingId) {
        if (_isCrowdfundingActive(_crowdfundingId)) {
            revert CrowdfundingStillActive();
        }
        if (crowdfundings[_crowdfundingId].finalized) {
            revert CrowdfundingAlreadyFinalized();
        }
        _finalize(_crowdfundingId);
    }

    /**
     * @notice Withdraws funds from a crowdfunding campaign
     * @dev Can only be called when the crowdfunding is in the Ended phase, not finalized with a winner, and the user has deposits.
     * The user must have enough ERC20 tokens (equal to their ETH deposit * CONVERSION_RATE) which will be burned during withdrawal.
     * The user must also approve this contract to spend their tokens.
     * @param _crowdfundingId The ID of the crowdfunding to withdraw from
     * @custom:throws CrowdfundingStillActive if the crowdfunding is still active
     * @custom:throws CrowdfundingAlreadyFinalized if the crowdfunding is finalized with a winner
     * @custom:throws NoDeposits if the user has no deposits
     * @custom:throws InsufficientTokenBalance if the user doesn't have enough tokens to withdraw
     * @custom:throws InsufficientTokenAllowance if the user hasn't approved enough tokens to be burned
     */
    function withdraw(
        uint256 _crowdfundingId
    ) public crowdfundingExists(_crowdfundingId) nonReentrant {
        if (_currentPhase(_crowdfundingId) != CrowdfundingPhase.Ended) {
            revert CrowdfundingStillActive();
        }
        if (crowdfundings[_crowdfundingId].finalized && crowdfundings[_crowdfundingId].winner != address(0)) {
            revert CrowdfundingAlreadyFinalized();
        }
        if (crowdfundings[_crowdfundingId].deposits[msg.sender] == 0) {
            revert NoDeposits();
        }
        _withdraw(_crowdfundingId);
    }

    // getters
    /**
     * @notice Gets the total amount raised for a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @return The total amount raised in wei
     */
    function totalRaised(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (uint256) {
        return _totalRaised(_crowdfundingId);
    }

    /**
     * @notice Gets the total number of funders for a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @return The total number of funders
     */
    function totalFunders(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (uint256) {
        return _totalFunders(_crowdfundingId);
    }

    /**
     * @notice Gets the total number of submissions for a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @return The total number of submissions
     */
    function totalSubmissions(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (uint256) {
        return _totalSubmissions(_crowdfundingId);
    }

    /**
     * @notice Gets the details of a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @return A CrowdfundingShort struct containing the crowdfunding details
     */
    function crowdfunding(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (CrowdfundingShort memory) {
        Crowdfunding storage cf = crowdfundings[_crowdfundingId];
        return CrowdfundingShort({
            id: cf.id,
            creator: cf.creator,
            token: cf.token,
            finalized: cf.finalized,
            winner: cf.winner,
            amountRaised: cf.amountRaised,
            fundingPhaseEnd: cf.fundingPhaseEnd,
            submissionPhaseEnd: cf.submissionPhaseEnd,
            votingPhaseEnd: cf.votingPhaseEnd,
            raiseCap: cf.raiseCap,
            developerFeePercentage: cf.developerFeePercentage,
            numSubmissions: cf.numSubmissions,
            numFunders: cf.numFunders,
            phase: _currentPhase(_crowdfundingId),
            submissionIds: cf.submissionIds
        });
    }

    /**
     * @notice Gets the current phase of a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @return The current phase of the crowdfunding
     */
    function crowdfundingPhase(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (CrowdfundingPhase) {
        return _currentPhase(_crowdfundingId);
    }

    /**
     * @notice Checks if a crowdfunding campaign is active
     * @param _crowdfundingId The ID of the crowdfunding
     * @return True if the crowdfunding is active, false otherwise
     */
    function isCrowdfundingActive(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (bool) {
        return _isCrowdfundingActive(_crowdfundingId);
    }

    /**
     * @notice Gets the IDs of all submissions for a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @return An array of submission IDs
     */
    function submissions(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (bytes32[] memory) {
        return crowdfundings[_crowdfundingId].submissionIds;
    }

    /**
     * @notice Checks if a user has voted for a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @param _voter The address of the user
     * @return True if the user has voted, false otherwise
     */
    function hasVoted(
        uint256 _crowdfundingId,
        address _voter
    ) public view crowdfundingExists(_crowdfundingId) returns (bool) {
        return _hasVoted(_crowdfundingId, _voter);
    }

    /**
     * @notice Checks if a user has deposited for a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @param _funder The address of the user
     * @return True if the user has deposited, false otherwise
     */
    function hasDeposited(
        uint256 _crowdfundingId,
        address _funder
    ) public view crowdfundingExists(_crowdfundingId) returns (bool) {
        return _hasDeposited(_crowdfundingId, _funder);
    }

    /**
     * @notice Gets the details of a specific submission
     * @param _crowdfundingId The ID of the crowdfunding
     * @param _submissionId The ID of the submission
     * @return A Submission struct containing the submission details
     */
    function submission(
        uint256 _crowdfundingId,
        bytes32 _submissionId
    ) public view crowdfundingExists(_crowdfundingId) returns (Submission memory) {
        return crowdfundings[_crowdfundingId].submissions[_submissionId];
    }

    // Internal methods

    /**
     * @notice Creates a new crowdfunding campaign
     * @dev Deploys a new ERC20 token and initializes the crowdfunding struct
     * @param _params The parameters for creating the crowdfunding
     */
    function _createCrowdfunding(
        CrowdfundingCreationParams memory _params
    ) internal {
        address tokenAddress = _deployERC20(_params.name, _params.symbol);
        Crowdfunding storage cf = crowdfundings[crowdfundingId];
        cf.id = crowdfundingId;
        cf.creator = msg.sender;
        cf.fundingPhaseEnd = _params.fundingPhaseEnd;
        cf.finalized = false;
        cf.numSubmissions = 0;
        cf.winner = address(0);
        cf.submissionPhaseEnd = _params.submissionPhaseEnd;
        cf.votingPhaseEnd = _params.votingPhaseEnd;
        cf.raiseCap = _params.raiseCap;
        cf.developerFeePercentage = _params.developerFeePercentage;
        cf.token = tokenAddress;
        emit CrowdfundingCreated(
            crowdfundingId,
            msg.sender,
            tokenAddress,
            _params.fundingPhaseEnd,
            _params.submissionPhaseEnd,
            _params.votingPhaseEnd,
            _params.raiseCap,
            _params.developerFeePercentage
        );
        // ok to use since it's not gonna overflow
        unchecked {
            ++crowdfundingId;
        }
    }

    /**
     * @notice Funds a crowdfunding campaign
     * @dev Updates the deposits, amount raised, and mints tokens to the funder
     * @param _crowdfundingId The ID of the crowdfunding to fund
     */
    function _fund(
        uint256 _crowdfundingId
    ) internal {
        Crowdfunding storage cf = crowdfundings[_crowdfundingId];
        if (cf.deposits[msg.sender] == 0) {
            cf.numFunders++;
        }
        cf.deposits[msg.sender] += msg.value;
        cf.amountRaised += msg.value;
        // 1 eth should be CONVERSION_RATE tokens
        IModelTokenERC20(cf.token).mint(msg.sender, msg.value * CONVERSION_RATE);
        emit CrowdfundingFunded(_crowdfundingId, msg.sender, msg.value);
    }

    /**
     * @notice Submits a solution to a crowdfunding campaign
     * @dev Adds the submission to the crowdfunding and increments the submission counter
     * @param _crowdfundingId The ID of the crowdfunding
     * @param _hash The hash of the solution
     * @param creator The address of the solution creator
     */
    function _submit(uint256 _crowdfundingId, bytes32 _hash, address creator) internal {
        crowdfundings[_crowdfundingId].submissionIds.push(_hash);
        crowdfundings[_crowdfundingId].submissions[_hash] =
            Submission({creator: creator, timestamp: block.timestamp, id: _hash});
        crowdfundings[_crowdfundingId].numSubmissions++;
        emit SolutionSubmitted(_crowdfundingId, _hash, creator);
    }

    /**
     * @notice Votes for a solution in a crowdfunding campaign
     * @dev Updates the vote counts and records the user's vote
     * @param _crowdfundingId The ID of the crowdfunding
     * @param _submissionId The ID of the submission to vote for
     */
    function _vote(uint256 _crowdfundingId, bytes32 _submissionId) internal {
        uint256 balance = IModelTokenERC20(crowdfundings[_crowdfundingId].token).balanceOf(msg.sender);
        if (balance == 0) {
            revert VotingBalanceZero();
        }
        crowdfundings[_crowdfundingId].votes.numVotes++;
        crowdfundings[_crowdfundingId].votes.votesPower += balance;
        // next line basically takes a snapshot of the balance at the time of voting
        crowdfundings[_crowdfundingId].votes.hasVoted[msg.sender] = balance;
        crowdfundings[_crowdfundingId].votes.submissionVotes[_submissionId] += balance;
        emit Vote(_crowdfundingId, _submissionId, msg.sender, balance);
    }

    /**
     * @notice Finalizes a crowdfunding campaign
     * @dev Determines the winner, mints developer fee tokens, and transfers the raised funds
     * @param _crowdfundingId The ID of the crowdfunding to finalize
     */
    function _finalize(
        uint256 _crowdfundingId
    ) internal {
        Crowdfunding storage cf = crowdfundings[_crowdfundingId];
        uint256 totalSupply = IModelTokenERC20(cf.token).totalSupply();
        uint256 votesPower = cf.votes.votesPower;

        // check if votes power is at least MIN_VOTES_POWER_PERCENTAGE % of total
        if (votesPower < (totalSupply * MIN_VOTES_POWER_PERCENTAGE) / 10000) {
            cf.finalized = true;
            emit CrowdfundingFinalizedWithoutWinner(_crowdfundingId);
            return;
        }

        // iterate through all sumbissions and find the one with the highest votes power, its creator will be the winner
        uint256 maxVotesPower = 0;
        bytes32 winnerSubmission = bytes32(0);
        for (uint256 i = 0; i < cf.numSubmissions; i++) {
            if (cf.votes.submissionVotes[cf.submissionIds[i]] > maxVotesPower) {
                maxVotesPower = cf.votes.submissionVotes[cf.submissionIds[i]];
                winnerSubmission = cf.submissionIds[i];
            }
        }
        address winner = cf.submissions[winnerSubmission].creator;
        // mint such amount of new tokens to the winner that at the end he will have the developerFee % of the total supply
        if (cf.developerFeePercentage > 0) {
            uint256 amountToMint = (totalSupply * cf.developerFeePercentage) / (10000 - cf.developerFeePercentage);
            IModelTokenERC20(cf.token).mint(winner, amountToMint);
        }
        cf.winner = cf.submissions[winnerSubmission].creator;
        payable(cf.winner).transfer(cf.amountRaised);
        cf.finalized = true;
        emit CrowdfundingFinalized(_crowdfundingId, cf.winner);
    }

    /**
     * @notice Withdraws funds from a crowdfunding campaign
     * @dev Burns the user's tokens at the conversion rate and returns their ETH.
     * Requires the user to have enough tokens
     * @param _crowdfundingId The ID of the crowdfunding to withdraw from
     */
    function _withdraw(
        uint256 _crowdfundingId
    ) internal {
        Crowdfunding storage cf = crowdfundings[_crowdfundingId];
        uint256 ethAmount = cf.deposits[msg.sender];
        uint256 tokenAmount = ethAmount * CONVERSION_RATE;

        IModelTokenERC20 token = IModelTokenERC20(cf.token);
        if (token.balanceOf(msg.sender) < tokenAmount) {
            revert InsufficientTokenBalance(token.balanceOf(msg.sender), tokenAmount);
        }

        token.burn(msg.sender, tokenAmount);
        cf.deposits[msg.sender] = 0;
        payable(msg.sender).transfer(ethAmount);

        emit Withdrawal(_crowdfundingId, msg.sender, ethAmount);
    }

    /**
     * @notice Deploys a new ERC20 token for a crowdfunding campaign
     * @param name The name of the token
     * @param symbol The symbol of the token
     * @return The address of the deployed token
     */
    function _deployERC20(string memory name, string memory symbol) internal returns (address) {
        return erc20Factory.deployERC20(name, symbol);
    }

    /**
     * @notice Gets the total number of funders for a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @return The total number of funders
     */
    function _totalFunders(
        uint256 _crowdfundingId
    ) internal view returns (uint256) {
        return crowdfundings[_crowdfundingId].numFunders;
    }

    /**
     * @notice Gets the total number of submissions for a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @return The total number of submissions
     */
    function _totalSubmissions(
        uint256 _crowdfundingId
    ) internal view returns (uint256) {
        return crowdfundings[_crowdfundingId].numSubmissions;
    }

    /**
     * @notice Gets the total amount raised for a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @return The total amount raised in wei
     */
    function _totalRaised(
        uint256 _crowdfundingId
    ) internal view returns (uint256) {
        return crowdfundings[_crowdfundingId].amountRaised;
    }

    /**
     * @notice Checks if a crowdfunding campaign is active
     * @param _crowdfundingId The ID of the crowdfunding
     * @return True if the crowdfunding is active, false otherwise
     */
    function _isCrowdfundingActive(
        uint256 _crowdfundingId
    ) internal view returns (bool) {
        return _currentPhase(_crowdfundingId) != CrowdfundingPhase.Ended;
    }

    /**
     * @notice Gets the current phase of a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @return The current phase of the crowdfunding
     */
    function _currentPhase(
        uint256 _crowdfundingId
    ) internal view returns (CrowdfundingPhase) {
        Crowdfunding storage cf = crowdfundings[_crowdfundingId];
        if (block.timestamp < cf.fundingPhaseEnd) {
            return CrowdfundingPhase.Funding;
        } else if (block.timestamp < cf.submissionPhaseEnd) {
            return CrowdfundingPhase.Submission;
        } else if (block.timestamp < cf.votingPhaseEnd) {
            return CrowdfundingPhase.Voting;
        } else {
            return CrowdfundingPhase.Ended;
        }
    }

    /**
     * @notice Checks if a user has voted for a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @param _voter The address of the user
     * @return True if the user has voted, false otherwise
     */
    function _hasVoted(uint256 _crowdfundingId, address _voter) internal view returns (bool) {
        return crowdfundings[_crowdfundingId].votes.hasVoted[_voter] != 0;
    }

    /**
     * @notice Checks if a user has deposited for a crowdfunding campaign
     * @param _crowdfundingId The ID of the crowdfunding
     * @param _funder The address of the user
     * @return True if the user has deposited, false otherwise
     */
    function _hasDeposited(uint256 _crowdfundingId, address _funder) internal view returns (bool) {
        return crowdfundings[_crowdfundingId].deposits[_funder] != 0;
    }

    /**
     * @notice Validates the timestamps for a crowdfunding campaign
     * @dev Checks that timestamps are in the correct order and meet minimum duration requirements
     * @param fundingPhaseEnd The end timestamp for the funding phase
     * @param submissionPhaseEnd The end timestamp for the submission phase
     * @param votingPhaseEnd The end timestamp for the voting phase
     * @custom:throws FundingPhaseEndMustBeInFuture if the funding phase end is not in the future
     * @custom:throws TimestampsNotInCorrectOrder if the timestamps are not in the correct order
     * @custom:throws MinimumFundingPhaseDurationNotMet if the funding phase duration is too short
     * @custom:throws MinimumSubmissionPhaseDurationNotMet if the submission phase duration is too short
     * @custom:throws MinimumVotingPhaseDurationNotMet if the voting phase duration is too short
     */
    function _validateTimestamps(
        uint256 fundingPhaseEnd,
        uint256 submissionPhaseEnd,
        uint256 votingPhaseEnd
    ) internal view {
        // Check that timestamps are in the correct order
        if (!(block.timestamp < fundingPhaseEnd)) {
            revert FundingPhaseEndMustBeInFuture(fundingPhaseEnd, block.timestamp);
        }

        if (!(fundingPhaseEnd < submissionPhaseEnd && submissionPhaseEnd < votingPhaseEnd)) {
            revert TimestampsNotInCorrectOrder();
        }

        // Check minimum durations for each phase
        if (fundingPhaseEnd - block.timestamp < MIN_FUNDING_PHASE_DURATION) {
            revert MinimumFundingPhaseDurationNotMet(fundingPhaseEnd - block.timestamp, MIN_FUNDING_PHASE_DURATION);
        }

        if (submissionPhaseEnd - fundingPhaseEnd < MIN_SUBMISSION_PHASE_DURATION) {
            revert MinimumSubmissionPhaseDurationNotMet(
                submissionPhaseEnd - fundingPhaseEnd, MIN_SUBMISSION_PHASE_DURATION
            );
        }

        if (votingPhaseEnd - submissionPhaseEnd < MIN_VOTING_PHASE_DURATION) {
            revert MinimumVotingPhaseDurationNotMet(votingPhaseEnd - submissionPhaseEnd, MIN_VOTING_PHASE_DURATION);
        }
    }

    /**
     * @notice Checks if a crowdfunding exists
     * @param _crowdfundingId The ID of the crowdfunding to check
     * @return True if the crowdfunding exists, false otherwise
     */
    function _crowdfundingExists(
        uint256 _crowdfundingId
    ) internal view returns (bool) {
        return crowdfundings[_crowdfundingId].creator != address(0);
    }

    // debug methods
    /**
     * @notice Changes the phase of a crowdfunding campaign (for debugging purposes)
     * @dev Only the contract owner can call this function
     * @param _crowdfundingId The ID of the crowdfunding to change the phase of
     * @param _phase The phase to change to
     */
    function _changePhase(
        uint256 _crowdfundingId,
        CrowdfundingPhase _phase
    ) public crowdfundingExists(_crowdfundingId) onlyOwner {
        Crowdfunding storage cf = crowdfundings[_crowdfundingId];
        if (_phase == CrowdfundingPhase.Funding) {
            cf.fundingPhaseEnd = block.timestamp + 1 days;
            cf.submissionPhaseEnd = block.timestamp + 2 days;
            cf.votingPhaseEnd = block.timestamp + 3 days;
        } else if (_phase == CrowdfundingPhase.Submission) {
            cf.fundingPhaseEnd = block.timestamp - 1 days;
            cf.submissionPhaseEnd = block.timestamp + 1 days;
            cf.votingPhaseEnd = block.timestamp + 2 days;
        } else if (_phase == CrowdfundingPhase.Voting) {
            cf.fundingPhaseEnd = block.timestamp - 2 days;
            cf.submissionPhaseEnd = block.timestamp - 1 days;
            cf.votingPhaseEnd = block.timestamp + 1 days;
        } else if (_phase == CrowdfundingPhase.Ended) {
            cf.fundingPhaseEnd = block.timestamp - 3 days;
            cf.submissionPhaseEnd = block.timestamp - 2 days;
            cf.votingPhaseEnd = block.timestamp - 1 days;
        }
        emit DebugPhaseChanged(_crowdfundingId, cf.fundingPhaseEnd, cf.submissionPhaseEnd, cf.votingPhaseEnd);
    }

}
