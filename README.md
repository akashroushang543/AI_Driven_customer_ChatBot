# USHA Employee Chatbot

This repository contains the source code for the USHA Employee Chatbot, developed during a summer internship at KMICRO Tech. The chatbot is built using the [Bot Framework](https://dev.botframework.com) and integrates with Azure services, including Conversational Language Understanding (CLU), Cognitive Services, and potentially Azure OpenAI for enhanced natural language processing. It assists employees with queries related to attendance, employee portal, feedback, benefits, talent management, and offboarding, aiming to reduce manual processes and improve efficiency.

The chatbot leverages AI and NLP to understand user intents, extract entities, and provide context-aware responses. It was designed for the USHA company to digitize customer and employee interactions, minimizing paper usage and human resources.

## Features

- **Intent Recognition and Entity Extraction**: Uses CLU to accurately classify user queries and extract relevant details (e.g., employee ID, query type).
- **Dialog Management**: Modular dialogs for handling specific topics like employee portal access, feedback surveys, medical insurance, talent acquisition, and offboarding.
- **Integration with Azure Services**: Incorporates Vision API, Speech API, Language API (including LUIS/QnA Maker), Decision API, and Azure OpenAI for intelligent responses.
- **Personalized Responses**: Provides tailored information based on user input, with support for feedback collection and surveys.
- **Scalability**: Deployable on Azure for handling multiple channels (e.g., web, messaging apps like WhatsApp, Telegram).
- **Security**: Includes network security, identity management, data protection, and threat detection.

## Prerequisites

- [Node.js](https://nodejs.org) version 10.14.1 or higher
  ```bash
  # Determine Node version
  node --version
  ```
- Microsoft Azure subscription for Bot Service, Cognitive Services, and related APIs.
- Bot Framework Emulator for local testing.
- Familiarity with JavaScript, Node.js, and Azure Portal.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/usha-employee-chatbot.git
   cd usha-employee-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add your Azure credentials and endpoints (e.g., MicrosoftAppId, MicrosoftAppPassword, CLU endpoints).

   Example `.env`:
   ```
   MicrosoftAppId=your-app-id
   MicrosoftAppPassword=your-app-password
   CLUProjectName=your-clu-project
   CLUDeploymentName=your-deployment
   CLUEndpoint=your-clu-endpoint
   ```

## To Run the Bot Locally

- Start the bot:
  ```bash
  npm start
  ```
- The bot will be available at `http://localhost:3978/api/messages`.

## Testing the Bot Using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop tool for testing and debugging bots locally.

- Install Bot Framework Emulator version 4.9.0 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases).
- Launch the Emulator.
- File -> Open Bot.
- Enter the Bot URL: `http://localhost:3978/api/messages`.
- Test queries like "What is my attendance?", "Provide feedback", or "Medical insurance details".

## Architecture

The chatbot follows a standard architecture:
- **User Input**: Text or speech via channels.
- **NLU/CLU**: Analyzes intent (e.g., "attendance") and entities (e.g., "employee").
- **Dialog Flow**: Manages conversations using dialog sets and component dialogs.
- **Backend Integration**: Retrieves data from databases, APIs, or knowledge bases.
- **Response Generation**: Uses Azure Cognitive Services and OpenAI for natural, context-aware replies.

For detailed methodology, refer to the internship report sections on Bot Framework SDK and Cognitive Services.

## Deployment to Azure

1. Create an Azure Bot resource in the Azure Portal.
2. Use the Azure CLI or Portal to deploy:
   - See [here](https://aka.ms/azuredeployment) for step-by-step instructions.
3. Configure channels (e.g., Web Chat, Microsoft Teams).
4. Integrate with Azure Cognitive Services and CLU for production.

## Future Scope

- Enhance with multimodal inputs (audio, images) using Azure Speech and Vision APIs.
- Implement reinforcement learning for better dialog management.
- Add real-time learning and adaptation.
- Integrate with knowledge graphs for more accurate information retrieval.
- Focus on ethical AI, bias mitigation, and privacy.

## References

- [Bot Framework Documentation](https://docs.botframework.com)
- [Azure Bot Services](https://azure.microsoft.com/en-in/products/bot-services)
- [Conversational Language Understanding](https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/conversational-language-understanding/)
- [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/)
- [OpenAI Documentation](https://beta.openai.com/docs/)
- Tamrakar, R., & Wani, N. (2021). Design and Development of Chatbot: A Review.
- Adamopoulou, E., & Moussiades, L. (2020). An overview of chatbot technology.

For full references, see the internship report.

## Further Reading

- [Bot Builder Basics](https://docs.microsoft.com/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Dialogs in Bot Framework](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-dialog?view=azure-bot-service-4.0)
- [Prompts in Bot Framework](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0)
- [Activity Processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [Bot Service Introduction](https://docs.microsoft.com/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Language Understanding (LUIS)](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/)
- [Bot Concepts](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [Restify Package](https://www.npmjs.com/package/restify)
- [Dotenv Package](https://www.npmjs.com/package/dotenv)
