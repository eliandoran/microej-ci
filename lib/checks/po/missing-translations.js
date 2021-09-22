export default function checkForMissingTranslations(context) {
  for (const poFile of context.poFiles) {
    console.log(poFile);
  }
}

