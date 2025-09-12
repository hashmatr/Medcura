import { createContext } from "react";
import React from "react";

export const AppContext = createContext();

const AppContextProvider = (props) =>{
    let currency = '$'
    const calage = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)
    let age= today.getFullYear() - birthDate.getFullYear()
    return age
    }
    
 const months = [
    " ",
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };
    const value = {
            calage
            ,currency
            ,slotDateFormat
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;