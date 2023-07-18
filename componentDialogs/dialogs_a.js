const { WaterfallDialog, ComponentDialog, DialogTurnStatus, DialogSet} = require('botbuilder-dialogs')
const {ActivityTypes} = require('botbuilder')
const {ConfirmPrompt,ChoicePrompt,DateTimePrompt,NumberPrompt,TextPrompt} = require('botbuilder-dialogs')
const { CustomQuestionAnswering } = require('botbuilder-ai');


const CHOICE_PROMPT  = 'CHOICE_PROMPT'
const CONFIRM_PROMPT ='CONFIRM_PROMPT'
const DATETIME_PROMPT ='DATETIME_PROMPT'
const NUMBER_PROMPT ='NUMBER_PROMPT'
const TEXT_PROMPT ='TEXT_PROMPT'
const WATERFALL_DIALOG = 'WATERFALL_DIALOG' 
var endDialog ='';

class PortalQuery extends ComponentDialog{
    constructor(conversationState,userState){
        super('PortalQuery')
        this.conversationState = conversationState;
        this.userState = userState;

this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
this.addDialog(new DateTimePrompt(DATETIME_PROMPT));
this.addDialog(new NumberPrompt(NUMBER_PROMPT));
this.addDialog(new TextPrompt(TEXT_PROMPT));


this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
// this.firstStep.bind(this),
// this.getName.bind(this),
// this.GetPhoneNumber.bind(this),
this.getQuery.bind(this),
this.getSummay.bind(this)
]))

this.initialDialogId = WATERFALL_DIALOG
try {
    this.qnaMaker = new CustomQuestionAnswering({
        knowledgeBaseId: process.env.ProjectName,
        endpointKey: process.env.LanguageEndpointKey,
        host: process.env.LanguageEndpointHostName
    });
} catch (err) {
    console.warn(`QnAMaker Exception: ${ err } Check your QnAMaker configuration in .env`);
}
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
    //     return await step.prompt(CONFIRM_PROMPT,`do you have query related to 'ESS Portal / SFA Portal / Workplace', 'Policy related Information', 'Payroll related information', 'Statutory Compliances', 'Grievance', 'Leave Management', 'Attendance regularization', 'List of Holidays', 'Working hours', 'Career Progression', 'Achievements & Recognition', 'Transfer movement', 'Expenses', 'POSH & Code of Conduct', 'Shift timings', 'IT Support', 'Travel Helpdesk'`,[`yes`,`No`])

    // }
    // async getName(step){
    //     if(step.result === true)
    //     {
    //     return await step.prompt(TEXT_PROMPT,`Provide your Name`)
    //     }else{
    //         endDialog = true;
    //         return await step.endDialog()
    //     }
    // }
    // async GetPhoneNumber(step){
    //     step.values.name = step.result  //this wil save the value of previous state
    //     return await step.prompt(NUMBER_PROMPT, `ENTER  YOUR PHINE NO.`)
    // }
    async getQuery(step){
        endDialog = false;
        //step.values.phone_no = step.result  //this wil save the value of previous state
        return await step.prompt(TEXT_PROMPT,`provide your query`)
    }
    async getSummay(step){
        
        step.values.Query = step.result  //this wil save the value of previous state
        var msg = `hello \r\n your query is :  " ${step.values.Query} " has been submitted \r\n  we will get back to you soon `
        // await step.context.sendActivity("you qurery output is")

    if (!process.env.ProjectName || !process.env.LanguageEndpointKey || !process.env.LanguageEndpointHostName) {
        const unconfiguredQnaMessage = 'NOTE: \r\n' +
            'Custom Question Answering is not configured. To enable all capabilities, add `ProjectName`, `LanguageEndpointKey`, and `LanguageEndpointHostName` to the .env file. \r\n' +
            'You may visit https://language.cognitive.azure.com/ to create a Custom Question Answering Project.';

        await step.context.sendActivity(unconfiguredQnaMessage);
    } else {
        console.log('Calling CQA');

        const enablePreciseAnswer = process.env.EnablePreciseAnswer === 'true';
        const displayPreciseAnswerOnly = process.env.DisplayPreciseAnswerOnly === 'true';
        const response = await this.qnaMaker.getAnswers(step.context, { enablePreciseAnswer: enablePreciseAnswer });

        // If an answer was received from CQA, send the answer back to the user.
     //   if (response.length > 0) {
            var activities = [];
            var answerText = response[0].answer;

            // Answer span text has precise answer.
            var preciseAnswerText = response[0].answerSpan?.text;
           if (!preciseAnswerText) {
                activities.push({ type: ActivityTypes.Message, text: answerText });
            } else {
                activities.push({ type: ActivityTypes.Message, text: preciseAnswerText });

                if (!displayPreciseAnswerOnly) {
                    // Add answer to the reply when it is configured.
                    activities.push({ type: ActivityTypes.Message, text: answerText });
                }
            }
            if( answerText === "No answer found, Contact the administrator"){
                await step.context.sendActivity(msg);

            }else{
            console.log(answerText)
            await step.context.sendActivities(activities);
        }
        // } else {
        //     await step.context.sendActivity('No answers were found.');
        // }
    }

    endDialog = true;
    return await step.endDialog();
    
}
async IsDialogComplete(){
    return endDialog

}
}
module.exports.PortalQuery  = PortalQuery  ;