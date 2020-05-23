import { LightningElement } from 'lwc';
export default class Newbutton extends LightningElement {
    goBack(event)
    {
        var url = window.location.href; 
        var value = url.substr(0,url.lastIndexOf('/') + 1);
        window.history.back();
        return false;
    }
}