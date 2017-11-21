import Realm from "realm";
import BaseFilterModel from "../models/BaseFilterModel";

const FilterSchema = {
  name: "Filter",
  primaryKey: "type_id",
  properties: {
    id: "int",
    name: "string",
    type: "string",
    type_id: "string"
  }
};

let repository = new Realm({
  schema: [FilterSchema]
});

let FilterService = {
  get: function(key) {
    return repository.objects("Filter").filtered("type = $0", key);
  },

  addRange: function(filters) {
    Object.getOwnPropertyNames(filters).map((filterName, key) => {
      filters[filterName].map((item, key) => {
        this.add(new BaseFilterModel(item.name, item.id, filterName));
      });
    });
  },

  add: function(filter) {
    repository.write(() => {
      filter.updatedAt = new Date();
      let exercise = repository.create("Filter", filter, true);
    });
  },
};

module.exports = FilterService;
