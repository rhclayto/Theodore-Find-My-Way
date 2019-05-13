        const data = stringify(json);

        headers = headers || {};

        headers['content-type'] = headers['content-type'] || 'application/json';

        res.send(data, status, headers);

      }



      const bodies = [];



      req.ondata = (body, start, length) => {

        const part = body.slice(start, length + start).toString();

        bodies.push(part);

      }



      req.onend = () => {

        const b = bodies.join('');



        switch (type) {

          case 'application/json':

            const parsedRes = jsonParse(b);

            req.body = parsedRes.value || parsedRes.err;

            break;

          case 'application/x-www-form-urlencoded':

            req.body = qs.parse(b);

            break;

          case 'text/plain':

          case 'text/html':

          default:

            req.body = b;

            break;

        }



        handler(req, res, params);

      }

    }



    this.router.route(method, route, _handler);

  }



  address () {

    return (this.server && this.server.address());

  }



  listen (port, onlisten = () => {}, onrequest = (req, res) => {}) {

    this.port = port || process.env.PORT || 8080;

    this.server = turbo.createServer(this.router.start());

    this.server.listen(this.port, onlisten);

    this.server.on('request', onrequest);

  }



  close () {

    this.server.close();

  }

}



module.exports = Theodore;



