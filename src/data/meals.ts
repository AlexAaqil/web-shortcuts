import chapati_beans from '../assets/images/menu/chapati-beans.jpg';
import chapati_cabbage from '../assets/images/menu/chapati-cabbage.jpeg';
import chapati_ndengu from '../assets/images/menu/chapati-ndengu.jpg';
import plain_githeri from '../assets/images/menu/plain-githeri.jpg';
import rice_beans from '../assets/images/menu/rice-beans.jpg';
import rice_beef from '../assets/images/menu/rice-beef.jpg';
import rice_cabbage from '../assets/images/menu/rice-cabbage.jpg';
import rice_eggs from '../assets/images/menu/rice-eggs.jpg';
import rice_fishballs from '../assets/images/menu/rice-fishballs.png';
import rice_ndengu from '../assets/images/menu/rice-ndengu.jpeg';
import spaghetti_bolognese from '../assets/images/menu/spaghetti-bolognese.jpeg';
import ugali_beef from '../assets/images/menu/ugali-beef.jpg';
import ugali_fishballs from '../assets/images/menu/ugali-fishballs.jpg';
import ugali_greens from '../assets/images/menu/ugali-greens.jpg';
import ugali_mala from '../assets/images/menu/ugali-mala.jpeg';
import ugali_matumbo from '../assets/images/menu/ugali-matumbo.jpeg';
import ugali_mayai from '../assets/images/menu/ugali-mayai.jpg';
import ugali_ndengu from '../assets/images/menu/ugali-ndengu.jpg';

export const mealsData = [
    {
      "category": "Rice",
      "meals": [
        {
          "name": "Rice + Beans",
          "image": rice_beans,
          "description": "Fragrant rice served with beans in coconut sauce.",
          "ingredients": ["Rice", "Beans", "Coconut milk", "Onions", "Garlic"],
          "instructions": "1. Cook rice...\n2. Prepare beans in coconut sauce...",
          "price": 95,
          "price_breakdown": "Beans:35, Garlic:20, Tomatoes:20, Onions:10, Corriander:10 = 95",
          "prepTime": "35 mins"
        },
        {
          "name": "Rice + Eggs (Shakshuka)",
          "image": rice_eggs,
          "description": "Rice served with shakshuka.",
          "ingredients": ["Rice", "Eggs", "Cooking oil", "Salt", "Pepper"],
          "instructions": "1. Cook rice...\n2. Fry eggs...",
          "price": 124,
          "price_breakdown": "Eggs:64, Tomatoes:20, Onions:10, Garlic:20, Corriander: 10 = 124",
          "prepTime": "20 mins"
        },
        {
          "name": "Rice + Fishballs",
          "image": rice_fishballs,
          "description": "Rice served with wet fish balls.",
          "ingredients": ["Rice", "Beans", "Coconut milk", "Onions", "Garlic"],
          "instructions": "1. Cook rice...\n2. Prepare beans in coconut sauce...",
          "price": 160,
          "price_breakdown": "Fishballs-3:90, Garlic:20, Tomatoes:20, Onions:10, Corriander:10, Lemon: 10 = 160",
          "prepTime": "35 mins"
        },
        {
          "name": "Rice + Cabbage",
          "image": rice_cabbage,
          "description": "Rice served with stir-fried cabbage and carrots.",
          "ingredients": ["Rice", "Cabbage", "Carrots", "Onions", "Spices"],
          "instructions": "1. Cook rice...\n2. Stir-fry cabbage...",
          "price": 80,
          "price_breakdown": "Cabbage:30, Onions:10, Tomatoes:20, Carrots:20 = 80",
          "prepTime": "25 mins"
        },
        {
          "name": "Rice + Ndengu",
          "image": rice_ndengu,
          "description": "Rice served with green grams (ndengu) in a flavorful sauce.",
          "ingredients": ["Rice", "Green grams", "Onions", "Tomatoes", "Spices"],
          "instructions": "1. Cook rice...\n2. Prepare ndengu...",
          "price": 130,
          "prepTime": "35 mins"
        },
        {
          "name": "Rice + Beef",
          "image": rice_beef,
          "description": "Rice served with beef stew. A classic combination.",
          "ingredients": ["Rice", "Beef", "Onions", "Tomatoes", "Spices"],
          "instructions": "1. Cook rice...\n2. Prepare beef stew...",
          "price": 200,
          "prepTime": "40 mins"
        }
      ]
    },
    {
      "category": "Chapati",
      "meals": [
        {
          "name": "Chapati + Ndengu",
          "image": chapati_ndengu,
          "description": "Soft chapatis served with green grams (ndengu) stew.",
          "ingredients": ["Flour", "Water", "Oil", "Salt", "Green grams", "Onions"],
          "instructions": "1. Prepare chapatis...\n2. Cook ndengu...",
          "price": 150,
          "prepTime": "50 mins"
        },
        {
          "name": "Chapati + Beans",
          "image": chapati_beans,
          "description": "Chapatis served with beans in a rich tomato sauce.",
          "ingredients": ["Flour", "Water", "Oil", "Salt", "Beans", "Tomatoes"],
          "instructions": "1. Prepare chapatis...\n2. Cook beans...",
          "price": 140,
          "prepTime": "50 mins"
        },
        {
          "name": "Chapati + Cabbage",
          "image": chapati_cabbage,
          "description": "Chapatis served with stir-fried cabbage and vegetables.",
          "ingredients": ["Flour", "Water", "Oil", "Salt", "Cabbage", "Carrots"],
          "instructions": "1. Prepare chapatis...\n2. Stir-fry cabbage...",
          "price": 130,
          "prepTime": "45 mins"
        }
      ]
    },
    {
      "category": "Githeri",
      "meals": [
        {
          "name": "Plain Githeri",
          "image": plain_githeri,
          "description": "Traditional Kenyan dish of boiled maize and beans.",
          "ingredients": ["Maize", "Beans", "Salt", "Water"],
          "instructions": "1. Soak maize and beans overnight...\n2. Boil until tender...",
          "price": 80,
          "prepTime": "60 mins"
        }
      ]
    },
    {
      "category": "Spaghetti",
      "meals": [
        {
          "name": "Spaghetti Bolognese",
          "image": spaghetti_bolognese,
          "description": "Classic Italian spaghetti with rich meat sauce.",
          "ingredients": ["Spaghetti", "Ground beef", "Tomato sauce", "Onions", "Garlic", "Herbs"],
          "instructions": "1. Cook spaghetti...\n2. Prepare bolognese sauce...",
          "price": 250,
          "prepTime": "35 mins"
        }
      ]
    },
    {
      "category": "Ugali",
      "meals": [
        {
          "name": "Ugali + Eggs",
          "image": ugali_mayai,
          "description": "Classic Kenyan ugali served with fried eggs. A protein-packed meal perfect for breakfast or dinner.",
          "ingredients": ["Ugali flour", "Water", "Salt", "Eggs", "Cooking oil"],
          "instructions": "1. Prepare ugali by boiling water and adding flour...\n2. Fry eggs to your liking...",
          "price": 120,
          "prepTime": "20 mins"
        },
        {
          "name": "Ugali + Greens",
          "image": ugali_greens,
          "description": "Ugali served with traditional Kenyan greens (sukuma wiki). A nutritious and affordable meal.",
          "ingredients": ["Ugali flour", "Water", "Sukuma wiki", "Onions", "Tomatoes", "Salt"],
          "instructions": "1. Prepare ugali...\n2. Cook greens with onions and tomatoes...",
          "price": 100,
          "prepTime": "20 mins"
        },
        {
          "name": "Ugali + Mala",
          "image": ugali_mala,
          "description": "Ugali served with mala (fermented milk). A traditional Kenyan meal.",
          "ingredients": ["Ugali flour", "Water", "Fermented milk"],
          "instructions": "1. Prepare ugali...\n2. Serve with cold fermented milk...",
          "price": 150,
          "prepTime": "15 mins"
        },
        {
          "name": "Ugali + Ndengu",
          "image": ugali_ndengu,
          "description": "Ugali served with green grams (ndengu). A protein-rich meal.",
          "ingredients": ["Ugali flour", "Water", "Green grams", "Onions", "Tomatoes", "Salt"],
          "instructions": "1. Prepare ugali...\n2. Cook green grams until tender...",
          "price": 130,
          "prepTime": "30 mins"
        },
        {
          "name": "Ugali + Beef",
          "image": ugali_beef,
          "description": "Ugali served with beef stew. A hearty and filling meal.",
          "ingredients": ["Ugali flour", "Water", "Beef", "Onions", "Tomatoes", "Spices"],
          "instructions": "1. Prepare ugali...\n2. Cook beef stew...",
          "price": 200,
          "prepTime": "40 mins"
        },
        {
          "name": "Ugali + Matumbo",
          "image": ugali_matumbo,
          "description": "Ugali served with tripe (matumbo). A delicacy for adventurous eaters.",
          "ingredients": ["Ugali flour", "Water", "Tripe", "Onions", "Tomatoes", "Garlic"],
          "instructions": "1. Prepare ugali...\n2. Clean and cook tripe...",
          "price": 180,
          "prepTime": "45 mins"
        }
      ]
    },
] as const;