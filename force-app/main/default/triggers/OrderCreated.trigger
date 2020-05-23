trigger OrderCreated on Order (before insert) {
    for (Order obj: trigger.new){
        obj.Order_Status__c = 'Created';
    }
}