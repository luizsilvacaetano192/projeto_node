import { unmaskDate, unmaskMoney } from './mask-helper';
import { DateTime, Interval } from "luxon";
import { maxYears, maxMonths, minEntryValuePercent } from './constants';

export const notZeroValidation = (value) => value != "R$ 0,00";

export const dateValidation = (value) => {
  const inverseDate = value.split('/').reverse().join('/');
  const date = new Date(inverseDate);

  return date.toString() != 'Invalid Date';
}

export const monthsValidation = (value, vm) => {

  let inputBirthDate = unmaskDate(vm.$v.birthDate.$model);

  const birthDate = DateTime.fromISO(inputBirthDate);
  const today = DateTime.now();
  const age = Interval.fromDateTimes(birthDate, today);

  if (value > maxMonths) {
    return false
  }

  if (age.length('years') + (value / 12) > maxYears) {
    return false;
  }

  return true;
}

export const buildingCostEntryValidation = (value, vm) => {
  //precisa fazer o parseFloat mesmo com o unmaskMoney ja fazendo, pois ele faz o toFixed(2) que retorna uma string
  const parsedBuildingCost = parseFloat(unmaskMoney(vm.$v.buildingCost.$model));
  const parsedEntryCost = parseFloat(unmaskMoney(value));

  const minEntryValue = parsedBuildingCost * minEntryValuePercent;

  const greaterThanMinimum = parsedEntryCost >= minEntryValue;
  const smallerThanTotal = parsedEntryCost < parsedBuildingCost;

  return greaterThanMinimum && smallerThanTotal;
}