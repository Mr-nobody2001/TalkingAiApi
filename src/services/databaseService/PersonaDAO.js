import {
  sequelize,
  Model,
  DataTypes,
} from "../../../config/database/databaseConfig.js";
import PersonaModel from "../../models/Persona.js";
import HobbieModel from "../../models/Hobbie.js";
import PersonaHobbieModel from "../../models/PersonaHobbie.js";
import NationalityModel from "../../models/Nationality.js";
import LanguageModel from "../../models/Language.js";
import ProfessionModel from "../../models/Profession.js";
import BirthplaceModel from "../../models/Birthplace.js";
import MaritalStatusModel from "../../models/MaritalStatus.js";
import VoiceModel from "../../models/Voice.js";
import PersonaVoiceModel from "../../models/PersonaVoice.js";

const Persona = PersonaModel(sequelize, Model, DataTypes);
const Hobbie = HobbieModel(sequelize, Model, DataTypes);
const PersonaHobbie = PersonaHobbieModel(sequelize, Model, DataTypes);
const Nationality = NationalityModel(sequelize, Model, DataTypes);
const Language = LanguageModel(sequelize, Model, DataTypes);
const Profession = ProfessionModel(sequelize, Model, DataTypes);
const Birthplace = BirthplaceModel(sequelize, Model, DataTypes);
const MaritalStatus = MaritalStatusModel(sequelize, Model, DataTypes);
const Voice = VoiceModel(sequelize, Model, DataTypes);
const PersonaVoice = PersonaVoiceModel(sequelize, Model, DataTypes);

Persona.init();
Hobbie.init();
PersonaHobbie.init();
Nationality.init();
Language.init();
Profession.init();
Birthplace.init();
MaritalStatus.init();
Voice.init();
PersonaVoice.init();

Persona.belongsToMany(Hobbie, { through: PersonaHobbie });
Hobbie.belongsToMany(Persona, { through: PersonaHobbie });
Persona.belongsTo(Nationality, { foreignKey: "nationalityId" });
Persona.belongsTo(Language, { foreignKey: "languageId" });
Persona.belongsTo(Profession, { foreignKey: "professionId" });
Persona.belongsTo(Birthplace, { foreignKey: "birthplaceId" });
Persona.belongsTo(MaritalStatus, { foreignKey: "maritalStatusId" });
Persona.belongsToMany(Voice, { through: PersonaVoice });
Voice.belongsToMany(Persona, { through: PersonaVoice });

const getPersona = async (personaId = 1) => {
  try {
    if (personaId <= 0) {
      const err = new Error(`Erro na consulta: id inválido`);
      err.status = 400;
      err.message_details = "Valores nulos ou negativos não são permitidos";
      throw err;
    }

    const persona = await Persona.findByPk(personaId, {
      attributes: [
        "name",
        "lastName",
        "age",
        "gender",
        "dateOfBirth",
        "lifeSummary",
      ],
      raw: true,
      include: [
        { model: Nationality, attributes: ["nationalityName"] },
        { model: Language, attributes: ["languageName"] },
        { model: Profession, attributes: ["professionName"] },
        { model: Birthplace, attributes: ["cityName"] },
        { model: MaritalStatus, attributes: ["status"] },
        {
          model: Voice,
          through: {
            PersonaVoice,
            attributes: ["rate", "pitch"],
          },
          attributes: ["name", "provider"],
        },
      ],
    });

    if (!persona) {
      const err = new Error(`Erro na consulta: Persona não encontrada`);
      err.status = 400;
      err.message_details =
        "A persona que você procura não existe no banco de dados";
      throw err;
    }

    const hobbie = await Persona.findByPk(personaId, {
      attributes: [],
      raw: false,
      include: [
        {
          model: Hobbie,
          through: {
            PersonaHobbie,
            attributes: [],
          },
          attributes: ["name"],
          as: "hobbies",
        },
      ],
    });

    const hobbies = [];

    for (let i = 0; i < 3; i++) {
      hobbies.push(hobbie.dataValues.hobbies[i].name);
    }

    persona.hobbies = hobbies;

    return persona;
  } catch (error) {
    // Se error.status for verdadeiro, lançar o erro; caso contrário, lançar um novo erro
    throw error.status ? error : new Error(` ${error}`);
  }
};

export default getPersona;
