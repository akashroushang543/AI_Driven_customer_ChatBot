const { WaterfallDialog, ComponentDialog, DialogTurnStatus, DialogSet} = require('botbuilder-dialogs')
const {ConfirmPrompt,ChoicePrompt,DateTimePrompt,NumberPrompt,TextPrompt} = require('botbuilder-dialogs')
const {CardFactory} = require('botbuilder')

const FeedbackFormCard = require('../Resources/adaptiveCards/feedbackform.json')
const CARDS =[   FeedbackFormCard   ]

const CHOICE_PROMPT  = 'CHOICE_PROMPT'
const CONFIRM_PROMPT ='CONFIRM_PROMPT'
const DATETIME_PROMPT ='DATETIME_PROMPT'
const NUMBER_PROMPT ='NUMBER_PROMPT'
const TEXT_PROMPT ='TEXT_PROMPT'
const WATERFALL_DIALOG = 'WATERFALL_DIALOG' 
var endDialog ='';

class FeedbackSurvey extends ComponentDialog{
    constructor(conversationState,userState){
        super('FeedbackSurvey')
        this.conversationState = conversationState;
        this.userState = userState;

this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
this.addDialog(new DateTimePrompt(DATETIME_PROMPT));
this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.validNumber));
this.addDialog(new TextPrompt(TEXT_PROMPT));


this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
this.firstStep.bind(this),
this.getName.bind(this),
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
      
   

    async firstStep(step){
        endDialog = false;
        await step.context.sendActivity({
            text: 'please enter your honest thought:',
            attachments: [CardFactory.adaptiveCard(CARDS[0])]
        }) 
        await step.context.activity.channelData.postBack === "true"
          
        //CARDS[0].onExecuteAction = function(action) { alert("Ow!"); }

        return await step.prompt(TEXT_PROMPT,``)
    }
    async getName(step){
        function fetchInputData(jsonData) {
          const inputData = {};
          const body = jsonData.body;
        
          for (const element of body) {
            if (element.type === 'Input.Text' || element.type === 'Input.ChoiceSet' || element.type === 'Input.Date') {
              const id = element.id;
              const value = step.result[id];
              inputData[id] = value;
              console.log(inputData[id]);
            }
          }
        
          return inputData;
        }
        
        // Usage example
        const inputData = fetchInputData(FeedbackFormCard);
        console.log(inputData);
        return await step.prompt(CONFIRM_PROMPT,`do you want to Submit the feedback Survey`,[`yes`,`No`])

    }
    async getSummay(step) {
        if (step.result === true) {
          step.values.name = step.result;
      
          const surveyData = step.context.activity.value;
          if (surveyData) {
            const { employeeName, employeeID, department, feedbackDate, jobSatisfaction, workLifeBalance, communication, teamCollaboration, managerialSupport, careerGrowth, trainingDevelopment, compensationBenefits, comments } = surveyData;
            
            // Use the values as needed
            console.log('Employee Name:', employeeName);
            console.log('Employee ID:', employeeID);
            console.log('Department:', department);
            console.log('Feedback Date:', feedbackDate);
            console.log('Job Satisfaction:', jobSatisfaction);
            console.log('Work-Life Balance:', workLifeBalance);
            console.log('Communication:', communication);
            console.log('Team Collaboration:', teamCollaboration);
            console.log('Managerial Support:', managerialSupport);
            console.log('Career Growth:', careerGrowth);
            console.log('Training and Development:', trainingDevelopment);
            console.log('Compensation and Benefits:', compensationBenefits);
            console.log('Comments:', comments);
      
            var msg = `Hello ${step.values.name}\nYour feedback summary:\nEmployee Name: ${employeeName}\nEmployee ID: ${employeeID}\nDepartment: ${department}\nFeedback Date: ${feedbackDate}\nJob Satisfaction: ${jobSatisfaction}\nWork-Life Balance: ${workLifeBalance}\nCommunication: ${communication}\nTeam Collaboration: ${teamCollaboration}\nManagerial Support: ${managerialSupport}\nCareer Growth: ${careerGrowth}\nTraining and Development: ${trainingDevelopment}\nCompensation and Benefits: ${compensationBenefits}\nComments: ${comments}`;
            
            await step.context.sendActivity(msg);
          }
      
          endDialog = true;
          return await step.endDialog();
        } else {
          endDialog = true;
          return await step.endDialog();
        }
      }

async IsDialogComplete(){
    return endDialog
}
}
module.exports.FeedbackSurvey = FeedbackSurvey ;