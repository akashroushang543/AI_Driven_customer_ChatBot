const { WaterfallDialog, ComponentDialog, DialogTurnStatus, DialogSet} = require('botbuilder-dialogs')
const {ConfirmPrompt,ChoicePrompt,DateTimePrompt,NumberPrompt,TextPrompt} = require('botbuilder-dialogs')
const { MessageFactory, CardFactory,  ActionTypes, ActivityTypes } = require('botbuilder');
var AdaptiveCards = require("adaptivecards");
const userlog = require('../Resources/adaptiveCards/userlogin.json')
const pay = require('../Resources/adaptiveCards/paySlip&salary.json')
const leave = require('../Resources/adaptiveCards/timeoff&leaves.json')
const perks = require('../Resources/adaptiveCards/benifits&perks.json')

const ACData = require("adaptivecards-templating");
const CARDS =[ pay, leave, perks ]

//import userlog from "../Resources/adaptiveCards/userlogin.json" assert { type: "json" };
let template = new ACData.Template(userlog);
let adaptiveCard = new AdaptiveCards.AdaptiveCard();
adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
  fontFamily: "Segoe UI, Helvetica Neue, sans-serif",
});


const CHOICE_PROMPT  = 'CHOICE_PROMPT'
const CONFIRM_PROMPT ='CONFIRM_PROMPT'
const DATETIME_PROMPT ='DATETIME_PROMPT'
const NUMBER_PROMPT ='NUMBER_PROMPT'
const TEXT_PROMPT ='TEXT_PROMPT'
const WATERFALL_DIALOG = 'WATERFALL_DIALOG' 
var endDialog ='';

class userprofile extends ComponentDialog{
    constructor(conversationState,userState){
        super('userprofile')
        this.conversationState = conversationState;
        this.userState = userState;

this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
this.addDialog(new DateTimePrompt(DATETIME_PROMPT));
this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.agePromptValidator));
this.addDialog(new TextPrompt(TEXT_PROMPT));


this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
//this.firstStep.bind(this),
this.getName.bind(this),
this.GetPhoneNumber.bind(this),
this.getQuery.bind(this),
this.getSummay.bind(this)
]))

this.initialDialogId = WATERFALL_DIALOG
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
          await dialogContext.beginDialog(this.id);
        }
      }
      
   
    // async firstStep(step){
    //     endDialog = false;
    //     return await step.prompt(CONFIRM_PROMPT,`do you have query related to ESS portal / SFA portal / Workplace`,[`yes`,`No`])

    // }
    async getName(step){
      //  await this.displayOptions(step)
        return await step.prompt(TEXT_PROMPT,`Provide your UserName`)
    }
    async GetPhoneNumber(step){
        step.values.name = step.result  //this wil save the value of previous state
        return await step.prompt(NUMBER_PROMPT, `Enter your phone no.`)
    }
    async getQuery(step){
        step.values.phone_no = step.result  //this wil save the value of previous state
        var cardPayload = template.expand({
            $root: {
              employeeName: `${step.values.name}`,
              mobileNo: `${step.values.phone_no}`,
            },
          });
          adaptiveCard.parse(cardPayload);
          const CARDS = [ adaptiveCard ]
          await step.context.sendActivity({
            text: 'please enter your honest thought:',
            attachments: [CardFactory.adaptiveCard(CARDS[0])]
        }) 

        await this.displayOptions(step);
    return await step.next();
    //return step.next();
       // return await step.prompt(TEXT_PROMPT,`provide your query`)
    }
    async getSummay(step){
        step.values.Query = step.result  //this wil save the value of previous state
        var msg = `hello ${step.values.name} \n you raised a Query from mobile no. ${step.values.phone_no} \n your query is :  " ${step.values.Query} " `
         await step.context.sendActivity(msg)
         endDialog = true;
         return await step.endDialog()
    }

async IsDialogComplete(){
    return endDialog
}


// async displayOptions(step) {
//     const reply = { type: ActivityTypes.Message };

//     // Suggested actions for the Hero card
//     const suggestedActions = [
//         { type: ActionTypes.ImBack, title: 'Payroll Information', value: 'payroll' },
//         { type: ActionTypes.ImBack, title: 'Leave Management', value: 'leave' },
//         { type: ActionTypes.ImBack, title: 'Achievement', value: 'achievement' },
//         { type: ActionTypes.ImBack, title: 'Attendance', value: 'attendance' }
//     ];

//     const card = CardFactory.heroCard(
//         '',
//         undefined,
//         suggestedActions,
//         { text: 'You can upload an image or select one of the following choices.' }
//     );

//     reply.attachments = [card];

//     await step.context.sendActivity(reply);
// }

async displayOptions(step) {
    const reply = { type: ActivityTypes.Message };

    // Suggested actions for the Hero card with ActionTypes.ShowCard
    const suggestedActions = [
      { type: ActionTypes.ShowCard, title: 'Payroll Information', value: CardFactory.adaptiveCard(CARDS[0]) },
      { type: ActionTypes.ShowCard, title: 'Leave Management', value: CardFactory.adaptiveCard(CARDS[1]) },
      { type: ActionTypes.ShowCard, title: 'Achievement', value: CardFactory.adaptiveCard(CARDS[2]) },
      { type: ActionTypes.ShowCard, title: 'Attendance', value: CardFactory.adaptiveCard(CARDS[1]) }
  ];
  
    const card = CardFactory.heroCard(
        '',
        undefined,
        suggestedActions,
        { text: 'You can upload an image or select one of the following choices.' }
    );

    reply.attachments = [card];

    await step.context.sendActivity(reply);
}

// Helper function to create a ShowCard for Payroll Information

}
module.exports.userprofile = userprofile ;