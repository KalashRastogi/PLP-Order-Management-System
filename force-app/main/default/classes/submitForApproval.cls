public with sharing class submitForApproval {
    @AuraEnabled
    public static void submitForApproval(Id opp){
        // Create an approval request for the Opportunity
        Approval.ProcessSubmitRequest req1 = new Approval.ProcessSubmitRequest();
        req1.setComments('Submitting request for approval automatically using Trigger');
        req1.setObjectId(opp);
        Approval.ProcessResult result = Approval.process(req1);
    }
}
