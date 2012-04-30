Notes
=====

> Keep track of your notes on the web.

This project is an exploration into various web techniques. In
particular we are aiming to use

* [CouchDB](http://couchdb.apache.org/ "CouchDB homepage")
* [Backbone(http://documentcloud.github.com/backbone/ "Backbone documentation page")

Couchapp
--------

We use the
[couchapp](http://couchapp.org/page/index "Homepage for Couchapp")
commandline tool to push our app to various databases.

### .couchapprc

If you are getting tired of explicitly mentioning the fully qualified
database url, create a 
[.couchapprc](http://couchapp.org/page/couchapp-config "Documentation on .couchapprc file")
file.

For example

    {
      "env" : {
        "default" : {
          "db" : "http://localhost:5984/mydb"
        },
        "prod" : {
          "db" : "http://admin:password@myhost.com/mydb"
        }
      }
    }

Attribution
-----------

Patrick Hoesly created the cork background.