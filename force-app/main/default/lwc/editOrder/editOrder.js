import { LightningElement, api } from 'lwc';

import ACCOUNTNAME_FIELD from '@salesforce/schema/Order.AccountId';
import ORDERSTARTDATE_FIELD from '@salesforce/schema/Order.EffectiveDate';
import CONTRACTNUMBER_FIELD from '@salesforce/schema/Order.ContractId';
import STATUS_FIELD from '@salesforce/schema/Order.Status';
import ORDERSTATUS_FIELD from '@salesforce/schema/Order.Order_Status__c';
import ORDERREMARK_FIELD from '@salesforce/schema/Order.Order_Remarks__c';

export default class RecordFormStaticContact extends LightningElement {
    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;

    fields = [ACCOUNTNAME_FIELD,
        ORDERSTARTDATE_FIELD,
        CONTRACTNUMBER_FIELD,
        STATUS_FIELD,
        ORDERSTATUS_FIELD,
        ORDERREMARK_FIELD
    ];
}