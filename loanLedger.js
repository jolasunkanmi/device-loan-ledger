const equipmentLedger = {
  "1": { type: "PC", status: "CheckedOut", borrower: { name: "John Smith", email: "john@acme.org" }, dueDate: "11/30/2025" },
  "2": { type: "Laptop", status: "CheckedIn", borrower: { name: "", email: "" }, dueDate: "" },
  "3": { type: "Laptop", status: "CheckedOut", borrower: { name: "Jane Doe", email: "jane@acme.org" }, dueDate: "10/31/2025" },
  "4": { type: "iPad", status: "CheckedIn", borrower: { name: "", email: "" }, dueDate: "" }
};

function checkoutDevice(ledger,assetTag,borrower){
  const dOne=ledger[assetTag];
  if(!dOne){
    return{ledger:ledger, borrower: borrower,message:`${assetTag} is not found`};
  }

  if(dOne.status==="CheckedOut"){
    return{ledger:ledger, borrower: borrower,message:`${assetTag} is already checked out`};
  }

  const changedLedger= serializeLedger(ledger);
  const updatedLedger= loadLedger(changedLedger);

   const device=updatedLedger[assetTag];
  device.borrower.name=borrower.name;
  device.borrower.email=borrower.email;
  device.status="CheckedOut";

  let confirmationString=`${assetTag} is available and the borrower's name is ${borrower.name}`

  return{
    ledger:updatedLedger, message:confirmationString
  }
}

function checkinDevice(ledger,assetTag){
  if(!ledger[assetTag]){
    return{ledger:ledger, message:`${assetTag} is not found`};
  }
  const changedLedger= serializeLedger(ledger);
  const updatedLedger= loadLedger(changedLedger);

  const device=updatedLedger[assetTag];
  device.borrower.name="";
  device.borrower.email="";
  device.dueDate="";
  device.status="CheckedIn";

  let confirmationString=`${assetTag} is available`

  return{
    ledger:updatedLedger, message:confirmationString
  }
}

function listOverdueDevices(ledger,today){
  let todaySplit= today.split("/");
  let todayNumber= Number(todaySplit[2]+todaySplit[0]+todaySplit[1]);
  let dueArray=[];

  for(const tag in ledger){
    const device= ledger[tag]
    let dueDates=device.dueDate.split("/");
    let dueDateNumber=Number(dueDates[2]+dueDates[0]+dueDates[1])

    if(device.status==="CheckedOut"&& dueDateNumber<todayNumber){
      dueArray.push(device);
    }
  }
  return dueArray.sort((a, b) => {
    const aSplit = a.dueDate.split("/");
    const bSplit = b.dueDate.split("/");
    
    const aNum = Number(aSplit[2] + aSplit[0] + aSplit[1]);
    const bNum = Number(bSplit[2] + bSplit[0] + bSplit[1]);
    
    return aNum - bNum;})
}


function serializeLedger(ledger){
  let ledgerString=JSON.stringify(ledger);
  return ledgerString;
}

function loadLedger(json){
  let ledgerObject=JSON.parse(json);
  return ledgerObject;
}
