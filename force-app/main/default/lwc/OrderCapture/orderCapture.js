import { LightningElement, wire, track, api } from 'lwc';
import getProductList from '@salesforce/apex/productAuraService.getProductList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import insertOrderItem from '@salesforce/apex/productAuraService.insertOrderItem';
import { refreshApex } from '@salesforce/apex';

export default class OrderCapture extends LightningElement {
    @track columns = [
        { label: 'Name', fieldName: 'Name'},
        { label: 'ProductCode', fieldName: 'ProductCode'},
        { label: 'Brand__c', fieldName: 'Brand__c'},
        { label: 'UnitPrice', fieldName: 'UnitPrice', type:'currency'}, 
        { label: 'Quantity', fieldName:'Quantity', type: 'number', editable: true},
    ];
    fields = [];
    field = {};
    @track rowNumber = false
    @api recordId;
    @track searchKey='';
    @track products = [];
    @track errors;
    @track draftValues;
    @track currentRecordId;
    @wire (getProductList, {
        name: '$searchKey'
    }) 
    wiredProduct({error, data}){
        if(data){
            console.log(data);
            this.products = data;
            this.products = [];
            console.log(this.recordId);
            for(let i = 0; i<data.length;i++){
                    this.products.push({
                        'ProductId': data[i].Id,
                        'PricebookEntryId': data[i].PricebookEntries[0].Id,
                        'Name': data[i].Name,
                        'ProductCode': data[i].PricebookEntries[0].ProductCode,
                        'Brand__c': data[i].Brand__c,
                        'UnitPrice': data[i].PricebookEntries[0].UnitPrice
                    });
            }
            console.log(this.products);
        }
        if(error){
            this.errors=error;
            console.log('errors:' + this.errors);
        }
    }
    handleChange(event){
        event.preventDefault();
        console.log('Value '+ event.target.value);
        this.searchKey = event.target.value;
    }
    insertRecords(OrderItems){
        for(let i=0;i<OrderItems.length;i++){
            insertOrderItem({
                OId:OrderItems[i].Orderid,
                PId: OrderItems[i].Product2Id,
                PEId: OrderItems[i].PricebookEntryId,
                Qua: OrderItems[i].Quantity,
                UP: OrderItems[i].UnitPrice
            });
        }
    }
    handleSave(event){
        console.log(event.detail.draftValues);
        console.log(event.detail.draftValues.length);
        console.log(this.products);
        for(let i=0;i<event.detail.draftValues.length;i++){
            if(event.detail.draftValues[i].Quantity!=""){
                console.log(event.detail.draftValues[i].Id.slice(4));
                insertOrderItem({
                    OId:this.recordId,
                    PId: this.products[event.detail.draftValues[i].Id.slice(4)].ProductId,
                    PEId: this.products[event.detail.draftValues[i].Id.slice(4)].PricebookEntryId,
                    Qua: event.detail.draftValues[i].Quantity,
                    UP: this.products[event.detail.draftValues[i].Id.slice(4)].UnitPrice
                });
            }
        }
        console.log('Done');
        const evt = new ShowToastEvent({
                title: 'Records Inserted',
                variant: 'success',
                mode: 'dismissable'
            });
        this.dispatchEvent(evt);
        this.draftValues = [];
        this.searchKey='';
        return refreshApex(this.products);
    }
    handleClear(){
        this.searchKey='';
    }
}