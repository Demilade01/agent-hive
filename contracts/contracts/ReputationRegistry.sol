// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * ReputationRegistry - On-chain agent performance tracking for AgentHive
 * Stores agent reputation scores, completion history, and earnings
 */

contract ReputationRegistry {
  /// @notice Agent reputation data
  struct AgentReputation {
    string agentId;           // Unique agent identifier (e.g., "ResearchBot_042")
    uint256 completedTasks;   // Total successful task completions
    uint256 failedTasks;      // Total failed tasks
    uint256 totalEarned;      // Total USDC earned (in wei, 6 decimals for USDC)
    uint256 qualityScore;     // Average quality score (0-100)
    uint256 createdAt;        // Timestamp of agent first record
    uint256 lastActiveAt;     // Timestamp of last activity
    bool exists;              // Flag to check if agent exists
  }

  /// @notice Task completion record
  struct TaskRecord {
    bytes32 taskId;           // Unique task hash
    string agentId;           // Agent who completed it
    uint256 reward;           // USDC earned
    uint8 qualityScore;       // Quality score (0-100)
    uint256 completedAt;      // Completion timestamp
  }

  // State variables
  mapping(string => AgentReputation) public agents;
  mapping(bytes32 => TaskRecord) public taskHistory;
  mapping(string => bytes32[]) public agentTasks;

  address public orchestrator;
  string[] public registeredAgents;

  // Events
  event AgentRegistered(string indexed agentId, uint256 timestamp);
  event TaskCompleted(
    bytes32 indexed taskId,
    string indexed agentId,
    uint256 reward,
    uint8 qualityScore,
    uint256 timestamp
  );
  event AgentUpdated(string indexed agentId, uint256 totalEarned, uint256 completedTasks);

  // Modifiers
  modifier onlyOrchestrator() {
    require(msg.sender == orchestrator, "Only orchestrator can call this");
    _;
  }

  // Constructor
  constructor() {
    orchestrator = msg.sender;
  }

  /**
   * @notice Register a new agent in the reputation system
   * @param agentId Unique agent identifier
   */
  function registerAgent(string calldata agentId) external onlyOrchestrator {
    require(bytes(agentId).length > 0, "Agent ID cannot be empty");
    require(!agents[agentId].exists, "Agent already registered");

    agents[agentId] = AgentReputation({
      agentId: agentId,
      completedTasks: 0,
      failedTasks: 0,
      totalEarned: 0,
      qualityScore: 0,
      createdAt: block.timestamp,
      lastActiveAt: block.timestamp,
      exists: true
    });

    registeredAgents.push(agentId);
    emit AgentRegistered(agentId, block.timestamp);
  }

  /**
   * @notice Record a completed task for an agent
   * @param agentId Agent who completed the task
   * @param taskId Unique task identifier
   * @param reward USDC earned (in wei)
   * @param qualityScore Quality score 0-100
   */
  function recordTaskCompletion(
    string calldata agentId,
    bytes32 taskId,
    uint256 reward,
    uint8 qualityScore
  ) external onlyOrchestrator {
    require(agents[agentId].exists, "Agent not registered");
    require(qualityScore <= 100, "Quality score must be 0-100");
    require(reward > 0, "Reward must be greater than 0");

    // Update agent reputation
    AgentReputation storage agent = agents[agentId];
    agent.completedTasks++;
    agent.totalEarned += reward;

    // Update quality score (running average)
    if (agent.completedTasks == 1) {
      agent.qualityScore = qualityScore;
    } else {
      agent.qualityScore = (agent.qualityScore + qualityScore) / 2;
    }

    agent.lastActiveAt = block.timestamp;

    // Record task in history
    TaskRecord memory record = TaskRecord({
      taskId: taskId,
      agentId: agentId,
      reward: reward,
      qualityScore: qualityScore,
      completedAt: block.timestamp
    });

    taskHistory[taskId] = record;
    agentTasks[agentId].push(taskId);

    emit TaskCompleted(taskId, agentId, reward, qualityScore, block.timestamp);
    emit AgentUpdated(agentId, agent.totalEarned, agent.completedTasks);
  }

  /**
   * @notice Record a failed task attempt
   * @param agentId Agent who failed
   */
  function recordTaskFailure(string calldata agentId) external onlyOrchestrator {
    require(agents[agentId].exists, "Agent not registered");

    AgentReputation storage agent = agents[agentId];
    agent.failedTasks++;
    agent.lastActiveAt = block.timestamp;
  }

  /**
   * @notice Get agent reputation data
   * @param agentId Agent to query
   */
  function getAgentReputation(string calldata agentId)
    external
    view
    returns (AgentReputation memory)
  {
    require(agents[agentId].exists, "Agent not found");
    return agents[agentId];
  }

  /**
   * @notice Get agent success rate (0-100)
   * @param agentId Agent to query
   */
  function getSuccessRate(string calldata agentId) external view returns (uint256) {
    AgentReputation memory agent = agents[agentId];
    require(agent.exists, "Agent not found");

    uint256 totalAttempts = agent.completedTasks + agent.failedTasks;
    if (totalAttempts == 0) return 0;

    return (agent.completedTasks * 100) / totalAttempts;
  }

  /**
   * @notice Get all tasks completed by an agent
   * @param agentId Agent to query
   */
  function getAgentTasks(string calldata agentId)
    external
    view
    returns (bytes32[] memory)
  {
    return agentTasks[agentId];
  }

  /**
   * @notice Get total registered agents count
   */
  function getRegisteredAgentsCount() external view returns (uint256) {
    return registeredAgents.length;
  }

  /**
   * @notice Get task record details
   * @param taskId Task to query
   */
  function getTaskRecord(bytes32 taskId)
    external
    view
    returns (TaskRecord memory)
  {
    return taskHistory[taskId];
  }

  /**
   * @notice Update orchestrator address (for contract upgrades)
   * @param newOrchestrator New orchestrator address
   */
  function setOrchestrator(address newOrchestrator) external onlyOrchestrator {
    require(newOrchestrator != address(0), "Invalid address");
    orchestrator = newOrchestrator;
  }
}
