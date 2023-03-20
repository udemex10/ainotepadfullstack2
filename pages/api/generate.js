import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const { inputValue, outputType } = req.body;
  if (inputValue.trim().length === 0 || !outputType) {
    res.status(400).json({
      error: {
        message: "Please provide a valid input value and output type",
      }
    });
    return;
  }

  let prompt;
  let responseMsg;
  if (outputType === 'Paragraph') {
    prompt = generateParagraphPrompt(inputValue);
    responseMsg = 'Generate paragraph response:';
  } else if (outputType === 'TodoList') {
    prompt = generateTodoListPrompt(inputValue);
    responseMsg = 'Generate todo list response:';
  } else {
    res.status(400).json({
      error: {
        message: "Invalid output type specified",
      }
    });
    return;
  }

  console.log(`Generate ${outputType} prompt:`, prompt);
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt,
      max_tokens: 1024,
      n: 1,
      temperature: 0.5,
    });
    console.log(responseMsg, completion);
    res.status(200).json({ result: completion.data.choices[0].text.trim() });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
function generateParagraphPrompt(paragraph) {
  const goodParagraph =
    paragraph[0].toUpperCase() + paragraph.slice(1);
  return `Write a Paragraph about a word or phrase.

Word or Phrase: Cat
Paragraph: Cats are truly fascinating creatures. With their big, bright eyes and tiny, adorable paws, they
            capture our hearts and fill our homes with love and joy. Their sharp claws are a testament to their natural hunting abilities, 
            and their two perky ears, which are incredibly sensitive to sounds, help them stay alert and aware of their surroundings. But perhaps the most 
            charming thing about cats is their soft and silky fur, which covers their tiny bodies and makes them a pleasure to pet and cuddle with. And of course, 
            we can't forget their furry tails, which are just as cute as the rest of them. When you look at a cat's face, you can't help but be charmed by their tiny nose,
             big mouth, and adorable whiskers that tickle your skin when they brush up against you. All of these sweet features combine to make cats some of the most beloved 
             and cherished pets in the world.
Word or Phrase: the world
Paragraph: Our world is a vast and wondrous place, teeming with life and beauty. With a population of around 7 billion people, it's a bustling hub of activity and diversity, 
            where cultures and traditions intersect and blend together in a vibrant tapestry of humanity. We are fortunate to live in a time where we have access to an abundance
            of resources and technology that make our lives easier and more comfortable. We have the freedom to explore and discover new things, to learn and grow, and to connect 
            with others who share our interests and passions. Everywhere you look, there are incredible people with fascinating stories and unique perspectives, speaking different 
            languages, living in different places, and following different traditions. And yet, despite our differences, we all share a common bond as members of the human family, 
            living on this beautiful planet that we call home.
Word or Phrase: ${goodParagraph}
Paragraph:`;
}

function generateTodoListPrompt(paragraph) {
  const goodToDoList =
      paragraph[0].toUpperCase() + paragraph.slice(1);
  return `Write a to-do list from a word or phrase.

Animal: Cat
To Do List: 1.) Make sure your cat always has access to clean water and food.
            2.) Feed your cat according to its age, size, and dietary requirements.
            3.) Clean your cat's litter box regularly to maintain good hygiene and prevent odors.
            4.) Brush your cat's fur regularly to prevent matting and shedding.
            5.) Play with your cat daily to provide exercise and mental stimulation.
            6.) Keep your cat's claws trimmed to prevent scratching and injury.
            7.) Give your cat regular baths to keep its fur clean and healthy.
            8.) Clean your cat's ears and eyes regularly to prevent infections.
            9.) Monitor your cat's behavior and health, and take it to the vet if you notice any unusual symptoms or changes.

            
Animal: My Homework
To Do List: 1.) Set up a dedicated study area that's free from distractions and comfortable to work in.
            2.) Create a study schedule that breaks down your tasks into manageable chunks and sets realistic deadlines.
            3.) Prioritize your assignments based on their due dates and level of difficulty.
            4.) Make sure you have all the necessary materials and resources, such as textbooks, notes, and reference materials.
            5.) Start by doing the assignments that require the most effort or are most urgent.
            6.) For each subject, review your notes and textbook chapters to ensure you understand the material.
            7.) For math homework, work through practice problems and check your answers against the solutions.
            8.) For science homework, conduct experiments and write up lab reports or summaries.
            9.) For history homework, read primary and secondary sources, take notes, and analyze key events and themes.  
Animal: ${goodToDoList}
To Do List:`;
}