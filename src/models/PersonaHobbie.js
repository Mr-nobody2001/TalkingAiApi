const PersonaHobbieModel = (sequelize, Model, DataTypes) => {
  return class PersonaHobbie extends Model {
    static init() {
      super.init({}, { sequelize, modelName: "personaHobbie", tableName: "personaHobbie" });
    }
  }
};

export default PersonaHobbieModel;
