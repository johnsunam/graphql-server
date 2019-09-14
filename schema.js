const { 
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
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

const EmployeeInputTypes = new GraphQLInputObjectType({
  name: 'EmployeeInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }
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
      resolve() {
        return employees;
      }
    }
  }
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    addEmployee: {
      type: EmployeeType,
      args: {
        data:{
          name: 'data',
          type: new GraphQLNonNull(EmployeeInputTypes)
        }
      },
      resolve(root, params, options) {
        const data = { ...params.data };
        data.id = employees.length + 1
        employees.push(data);
        return data;
      }
    },
    updateEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        data: {
          name: 'data',
          type: new GraphQLNonNull(EmployeeInputTypes)
        }
      },
      resolve (root, params, options) {
        const data = { ...params.data }
        employees.map(employee => {
          if (params.id === employee.id) {
            employee.name = data.name;
            employee.email = data.email;
          }
        });
        data.id = params.id;
        return data;
      }
    } 
  }
});

module.exports = new GraphQLSchema({ 
  query: RootQuery,
  mutation: RootMutation,
});