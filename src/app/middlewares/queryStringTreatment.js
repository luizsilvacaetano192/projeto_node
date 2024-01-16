module.exports = {
  treatQueryString (req, res, next) {
    req.query.limit = !(req.query.limit === '' || !('limit' in req.query)) ? req.query.limit : '10'
    req.query.page = !(req.query.page === '' || !('page' in req.query)) ? req.query.page : '1'
    req.query.sortBy = !(req.query.sortBy === '' || !('sortBy' in req.query)) ? req.query.sortBy : 'id'
    req.query.descending = !(req.query.descending === '' || !('descending' in req.query)) ? req.query.descending : 'true'

    req.where = {
      name: { $regex: '.*.*', $options: '-i' },
      role: ''
    }
    if (typeof req.query.text !== 'undefined') {
      req.where.name = { $regex: `.*${req.query.text}.*`, $options: '-i' }
      delete req.query.text
    }
    if (typeof req.query.role !== 'undefined') {
      req.where.role = req.query.role.toUpperCase()
      delete req.query.role
    }

    const sort = {}
    sort[req.query.sortBy] = req.query.descending === 'true' ? 1 : -1
    delete req.query.sortBy
    delete req.query.descending
    req.query.sort = sort

    if (typeof req.query.pagination !== 'undefined') {
      req.query.pagination = req.query.pagination === 'false'
        ? JSON.parse(req.query.pagination)
        : true
    }

    return next()
  }

}
