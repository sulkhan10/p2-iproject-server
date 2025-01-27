const { User,Event } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const axios = require("axios");

class UserController {
  static async register(req, res, next) {
    try {
      let { username, email, password } = req.body;
      console.log(req.body);
      let role = "user";
      let user = await User.create({
        username,
        email,
        password,
        role,
      });
      res
        .status(201)
        .json({ username: user.username, email: user.email, role: user.role });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      let { email, password } = req.body;
      let user = await User.findOne({ where: { email } });

      if (!email || !password) {
        throw { name: "EmailOrPasswordRequired" };
      }

      if (!user) {
        throw { name: "InvalidCredentials" };
      }

      let isValid = await comparePassword(password, user.password);
      if (!isValid) {
        throw { name: "InvalidCredentials" };
      }
      let payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
      let token = generateToken(payload);
      res
        .status(200)
        .json({
          access_token: token,
          username: user.username,
          role: user.role,
          userId: user.id,
        });
    } catch (error) {
      next(error);
    }
  }
  static animefinder(req, res, next) {
    let { name } = req.body;
    const options = {
      method: "GET",
      url: "https://anime-db.p.rapidapi.com/anime",
      params: {
        page: "1",
        size: "10",
        search: name,
        genres: "Fantasy,Drama",
        sortBy: "ranking",
        sortOrder: "asc",
      },
      headers: {
        "X-RapidAPI-Key": "179e0bdf60mshabb49e1432f32b9p194a9ejsn92b309969690",
        "X-RapidAPI-Host": "anime-db.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then((response) => {
        res.status(200).json(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  static  getNews(req, res, next) {
    let page = req.query.page
    const options = {
      method: "GET",
      url: "https://api.jikan.moe/v4/schedules",
      params: {  
        // sfw: true,
        // q: "naruto",
        // order_by : "popularity",
        // sort: "desc",
        limit: 15,
        page: 1,
      }
    };
    if (page) {
      options.params.page = page
    }
    console.log(options.params.page);
    console.log(page);
    console.log(req.query);

    axios
      .request(options)
      .then((response) => {
        // console.log(response);
        res.status(200).json(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  static async allEvent(req, res, next) {
    try {

      let events = await Event.findAll({ order: [
        ['id'],
    ],});
    // console.log(animePlaylist);
      res.status(201).json(events);
    } catch (error) {
      next(error);
    }
  }

  static async 
}

module.exports = UserController;
