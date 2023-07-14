// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { PortalQuery } = require('./componentDialogs/dialogs_a')
const { FeedbackSurvey } = require('./componentDialogs/dialog_b')
const { DialogSet } = require('botbuilder-dialogs');
const { CustomQuestionAnswering } = require('botbuilder-ai')


class CustomerBot extends ActivityHandler {
    constructor(conversationState,userState) {
        super();
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialogState = conversationState.createProperty("dialogState")
        this.dialogSet = new DialogSet(this.dialogState);
        this.PortalQuery = new PortalQuery(this.conversationState, this.userState, this.dialogSet);
        this.FeedbackSurvey = new FeedbackSurvey(this.conversationState, this.userState, this.dialogSet);
        this.previousIntent = this.conversationState.createProperty('previousIntent')
        this.conversationData = this.conversationState.createProperty('conversationData')

        try {
            this.qnaMaker = new CustomQuestionAnswering({
                knowledgeBaseId: process.env.ProjectName,
                endpointKey: process.env.LanguageEndpointKey,
                host: process.env.LanguageEndpointHostName
            });
        } catch (err) {
            console.warn(`QnAMaker Exception: ${ err } Check your QnAMaker configuration in .env`);
        }
        // const dispatchRecognizer = new QnAMakerRecognizer({
        //     MicrosoftAppId: process.env.MicrosoftAppId,
        //     endpointKey: process.env.LanguageEndpointKey,
        //     endpoint: process.env.LanguageEndpointHostName,

        // },{
        //     EnablePreciseAnswer:true,
        //     DisplayPreciseAnswerOnly:false
        // }, true
        // )

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {

           // const qanda = await dispatchRecognizer.recognize(context)
            //console.log(qanda)

            await this.dispatchToInternetAsync(context)
            // const replyText = `Rayan: ${ context.activity.text }`;
            // await context.sendActivity(MessageFactory.text(replyText, replyText));
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            await this.sendWelecomeMessage(context)
            
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
        this.onDialog(async (context, next)=>{
            await this.conversationState.saveChanges(context, false)
            await this.userState.saveChanges(context, false)
            await next()
        })
    }
    async sendWelecomeMessage(turnContext){
        const {activity} = turnContext

        for( const idx in activity.membersAdded){
            if(activity.membersAdded[idx].id != activity.recipient.id){
                const welcomeMessage = `welcome to Usha customer care ${activity.membersAdded[idx].name }.`
                await turnContext.sendActivity(welcomeMessage)
                await this.sendSuggestedActions(turnContext)
            }
        }
    }

    async sendSuggestedActions(turnContext){
        var reply = MessageFactory.suggestedActions(['Employee Query', 'my profile ','Feedback',])
        await turnContext.sendActivity(reply)
    }

    async dispatchToInternetAsync(context){
            var currentIntent =''
            const previousIntent = await this.previousIntent.get(context,{})
            const conversationData = await this.conversationData.get(context,{})

            if(previousIntent.intentName && conversationData.endDialog === false)
            {
                currentIntent = previousIntent.intentName
            }else if (previousIntent.intentName && conversationData.endDialog === true){
            currentIntent = context.activity.text
            }else{
                currentIntent = context.activity.text
                await this.previousIntent.set(context, {intentName: context.activity.text})
            }
        switch(currentIntent){
            case 'Employee Query':
                console.log('inside query dialog ')
                await this.conversationData.set(context, {endDialog: false})
                await this.PortalQuery.run(context,this.dialogState)
                conversationData.endDialog = await this.PortalQuery.IsDialogComplete()
                if(conversationData.endDialog){
                    await this.previousIntent.set(context, {intentName: null})
                    await this.sendSuggestedActions(context)
                }
                break;

            case 'Feedback':
                    console.log('inside Feedback Survey dialog ')
                    await this.conversationData.set(context, {endDialog: false})
                    await this.FeedbackSurvey.run(context,this.dialogState)
                    conversationData.endDialog = await this.FeedbackSurvey.IsDialogComplete()
                    if(conversationData.endDialog){
                        await this.previousIntent.set(context, {intentName: null})
                        await this.sendSuggestedActions(context)
                    }
                    break;

            default:
                await this.previousIntent.set(context, {intentName: null})
                await context.sendActivity(`please select one of the suggested actions given below`)
                await this.sendSuggestedActions(context);
                console.log(`incoming message did not be solved`)
        }

    }
}
module.exports.CustomerBot = CustomerBot;
