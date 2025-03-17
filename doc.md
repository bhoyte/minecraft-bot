# Advanced Minecraft AI Project

This project implements an intelligent autonomous agent for Minecraft using a microservices architecture that integrates several cutting-edge AI technologies:

- **Microservices Architecture** - Modular, maintainable AI components
- **Sketch-of-Thought (SoT)** - Efficient reasoning paradigms for LLMs
- **MiDaS** - Depth perception from 2D images
- **Video PreTraining (VPT)** - Action predictions learned from human gameplay
- **PrismarineJS** - Low-level Minecraft API and utilities
- **ZeroMQ** - Inter-service communication

## Design Philosophy

Our project takes a microservices approach to AI agent development, differentiating it from monolithic frameworks:

1. **Modular Architecture** - Each AI capability is implemented as an independent service
2. **Communication via ZeroMQ** - Fast, reliable messaging between services
3. **Language Flexibility** - Node.js for the agent core, Python for AI services
4. **Configuration-Driven** - Easy customization through JSON configuration files
5. **Mock-First Development** - Services implement mock responses before full AI integration
6. **Independent Testing** - Each service can be tested in isolation

## Key Components

### Core Agent Framework
The central Node.js application that coordinates the agent's behavior using a perception-reasoning-action cycle.

### Microservices
- **Screen Capture Service**: Captures frames from Minecraft using D3DShot or MSS
- **MiDaS Service**: Provides depth perception from 2D images
- **VPT Service**: Predicts Minecraft actions based on screen captures
- **SoT Service**: Implements Sketch-of-Thought reasoning for decision making

### Technology Stack
- **Node.js**: Core agent implementation
- **Python**: AI service implementations
- **ZeroMQ**: Inter-service communication
- **PrismarineJS/Mineflayer**: Minecraft bot API
- **Various AI Models**: MiDaS, VPT (with mock implementations for development)

## Current Implementation

### Components Implemented

1. **Screen Capture Service**
   - Captures frames from Minecraft client
   - Publishes frames via ZeroMQ for other services to consume
   - Configurable FPS, window targeting, and backend selection

2. **MiDaS Depth Perception Service**
   - Processes 2D images to estimate depth
   - Provides spatial awareness to the agent
   - Configurable model types and processing parameters

3. **VPT Action Prediction Service**
   - Predicts optimal Minecraft actions from screen captures
   - Implements comprehensive action space for Minecraft
   - Uses mock predictions for initial development

4. **SoT Reasoning Service**
   - Implements the Sketch-of-Thought paradigm for efficient reasoning
   - Integrates with LLM providers for decision-making
   - Configurable reasoning parameters

5. **Agent Core Framework**
   - Service manager for coordinating microservices
   - ZeroMQ communication between services
   - Integration of perception, reasoning, and action systems

## Next Steps

1. **Testing**
   - Test each service individually
   - Validate integration between services
   - Create demonstration tasks to showcase capabilities

2. **Integration Refinement**
   - Optimize communication between services
   - Improve error handling and reliability

3. **Real Model Integration**
   - Replace mock implementations with actual AI models
   - Fine-tune models for Minecraft-specific tasks

4. **Performance Optimization**
   - Optimize for real-time gameplay
   - Profile and address bottlenecks

## Contributing

Contributions are welcome! Please see the issues list for ways to contribute.
