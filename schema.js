const { 
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList
 } = require('graphql');

 const employees = [
   {
     id: 1,
     name: 'John',
     email: 'john@test.com',
   },
   {
     id: 2,
     name: 'Sunam',
     email: 'sunam@test.com',
   },
   {
     id: 3,
     name: 'Rushab',
     email: 'rushab@test.com',
   }
 ]

const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    employee: {
      type: EmployeeType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        for(let i=0; i < employees.length; i++) {
          if(employees[i].id === args.id) {
            return employees[i];
          }
        }
      }
    },
    employees: {
      type: new GraphQLList(EmployeeType),
      args: { },
      resolve(parentValue, args) {
        return employees;
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery });