import * as z from 'zod';

const AmountSchema = z.coerce.number();

// Custom validation error
class ValidationError extends Error {}

// Available coins and banknotes
const currencyUnits = [
  1,
  5,
  10,
  20,
  50,
  100,
  500,
  1000,
  2000,
  5000,
] as const;

type ChargeResult = Partial<Record<typeof currencyUnits[number], number>>;

/**
 * Returns a number of currency units left after charging the `amountCharged` from `amountGiven`.
 * 
 * TODO: Add unit test cases for:
 *  - When given amount is smaller than charged amount
 *  - When given amount is equal to charged amount
 */
const charge = (
  amountCharged: number,
  amountGiven: number,
): ChargeResult => {
  if (amountCharged > amountGiven) {
    throw new ValidationError(`Given amount ${amountGiven} is too little to charge ${amountCharged}.`);
  }

  const chargeResult: ChargeResult = {};
  if (amountCharged === amountGiven) {
    return chargeResult;
  }

  // Sort currency units from highest to lowest
  const sortedCurrencyUnits = [...currencyUnits].sort((a, b) => b - a);

  let amountLeft = amountGiven - amountCharged;
  for (const currentUnit of sortedCurrencyUnits) {
    if (amountLeft < currentUnit) {
      continue;
    }

    const amountOfCurrencyUnits = Math.floor(amountLeft / currentUnit);
    chargeResult[currentUnit] = amountOfCurrencyUnits;

    amountLeft -= amountOfCurrencyUnits * currentUnit;
  }

  return chargeResult;
};

const amountCharged = AmountSchema.parse(process.argv[2]);
const amountGiven = AmountSchema.parse(process.argv[3]);

try {
  console.log(charge(amountCharged, amountGiven));
} catch (err) {
  // Format *only* validation errors
  if (err instanceof ValidationError) {
    console.log(err.message);
  } else {
    throw err;
  }
}
