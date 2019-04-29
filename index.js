class Collection {

    constructor(obj = {}) {
        this._id = 0
        this.collection = {}
        this.addID = obj.addID
    }

    get id() {
        return this._id++
    }

    get count() {
        return Object.values(this.collection).length;
    }

    /**
     * Se existir parâmetro retornar registros com filtro.
     * Se não existir parâmetro retornar todos os registros. 
     */

    find(options = {}) {
        let result = Object.values(this.collection).slice(); // Clone
        let arrResult = [];
        let { where, attributes, id } = options

        if (where) {
            if (id === false && !where) result.forEach((item) => delete item.id);
            // if (!where) return result;

            if ((Array.isArray(where) || Number.isInteger(where))) {
                if (Number.isInteger(where)) where = [where];
                result = result.filter(item => where.includes(item.id));
            } else {
                where = Object.entries(where) // Json to array
                where.forEach(w => result = result.filter(item => item[w[0]] == w[1]));
            }
        }

        if (id === false) result.forEach((item) => delete item.id);

        // Attributes
        if (attributes) {
            if (attributes[1] == 'array') {
                let newResult = [];
                result.forEach(item => newResult.push(item[attributes[0]]))
                result = newResult;
            } else {
                result.forEach(item => {
                    let newResult = {};
                    attributes.forEach(attribute => {
                        newResult[attribute] = item[attribute]
                    })
                    arrResult.push(newResult)
                })
                result = arrResult;
            }

        }
        return result
    }

    delete(where) {
        let result = Object.values(this.collection).slice() // Clone
        let founds = this.find(where).map(item => item.id);
        let deleted = result.filter(item => founds.includes(item.id));

        founds.forEach(item => delete this.collection[item])
        return deleted
    }

    insert(body) {
        let arrCreated = [];
        if (!Array.isArray(body)) body = [body];
        body.forEach(item => {
            let id = this.id
            let created = this.addID === false ? { ...item } : { id, ...item }
            this.collection[id] = created
            arrCreated.push(created)
        })
        return arrCreated
    }

    update(where, body) {
        let arrResult = { before: [], after: [] }
        let founds = this.find(where).map(item => item.id);

        founds.forEach(id => {
            let registerOld = this.collection[id]
            if (registerOld) {
                let registerNew = { ...registerOld, ...body }
                this.collection[id] = registerNew
                arrResult.before.push(registerOld)
                arrResult.after.push(registerNew)
            }
        })
        return arrResult.before.length ? arrResult : []
    }

    include(where, arr = []) {
        let result = Object.values(this.collection).slice() // Clone
        let founds = this.find(where).map(item => item.id);
        result = result.filter(item => founds.includes(item.id));
        arr.forEach(item => {
            result.push(item)
        })
        return result
    }

    exclude(where = {}) {
        let result = Object.values(this.collection).slice() // Clone
        if (Number.isInteger(where)) where = [where];
        let founds = this.find(where).map(item => item.id);
        let isEmpty = Object.keys(where).length;
        let result2 = result.filter(item => !founds.includes(item.id));
        return isEmpty ? result2 : result;
    }

    merge() {
        let result = [];
        let arrKey = [];
        let mandatory = Object.keys(arguments[arguments.length - 1])[0] == 'mandatory';
        let mandatoryValue = arguments[arguments.length - 1].mandatory;
        let attr = arguments[0];
        var args = Object.values(arguments);
        args.shift();
        if (mandatory) args.pop();
        if (this.find().length) {
            args.unshift(this.find())
        } else {
            args.unshift(this.insert(args.shift()))

        }
        if (mandatoryValue > args.length || mandatoryValue < 1) return [];

        // // Obtem todas as chaves sem repetir e de todos os arrays.
        if (mandatory) {
            arrKey = (mandatoryValue > args.length || mandatoryValue < 1)
                ? []
                : args[mandatoryValue - 1].map(item => item[attr]);
        } else {
            args.forEach(item => {
                let keys = item.map(item => item[attr]);
                keys.forEach(item => { if (!arrKey.includes(item)) arrKey.push(item) })
            })
        }
        // // Realiza merge de todos os arrays vinculados pela key.
        arrKey.forEach(key => {
            let filters = [];
            args.forEach(arg => {
                let filter = arg.filter(item => item[attr] == key);
                if (filter.length) filters.push(filter[0])
            })
            let merge = Object.assign(...filters);
            result.push(merge);
        })

        this.collection = result;
        return result
    }


    getSchema() {
        var schema = {}
        Object.entries(this.collection[0]).forEach(([key, value]) => {
            let tipo = Array.isArray(value) ? 'array' : typeof value
            schema[key] = tipo
        })
        return schema
    }

}


module.exports = Collection