class APIFeatures {
  constructor(query, querystring) {
    this.query = query;
    //querystring = req.query
    this.querystring = querystring;
  }
  filter() {
    //1 filtering
    const queryObj = { ...this.querystring };
    const excludesFields = ['page', 'sort', 'limit', 'fields'];
    //console.log(req.query);
    excludesFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sorting() {
    if (this.querystring.sort) {
      const sortBy = this.querystring.sort.split(',').join(' ').toString();
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    //limiting our api
    if (this.querystring.fields) {
      const fields = this.querystring.fields.split(',').join(' ').toString();
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = this.querystring.page * 1 || 1;
    const limit = this.querystring.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // if (this.querystring.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error("This page does not exits");
    // }
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
