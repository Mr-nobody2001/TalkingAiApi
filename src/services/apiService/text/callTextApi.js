import { textApiDefaultValues } from "../../../../config/defaultValues/defaultValues.js";
import { config } from "dotenv";
import OpenAI from "openai";

config();

const callTextApi = async (
  chatContext,
  model = textApiDefaultValues.modelDefault,
  temperature = textApiDefaultValues.temperatureDefault,
  max_tokens = textApiDefaultValues.max_tokens_default
) => {
  const openai = new OpenAI({ apiKey: process.env.CHAT_GPT_API_KEY });

  const completion = await openai.chat.completions.create({
    model: model,
    messages: chatContext,
    temperature: temperature,
    max_tokens: max_tokens,
    stream: true,
  });
  
  return completion;
};

export default callTextApi;
