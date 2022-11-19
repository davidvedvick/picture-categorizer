## Services Framework

| Class Name  | Function                                                                       |
|-------------|--------------------------------------------------------------------------------|
| Curator     | Stores uploaded images on server, associates metadata with images              |
| Librarian   | Looks up images and image data based on indexes or metadata                    |
| Designer    | Draws templates for viewing images, creates user friendly inputs for curator   |
| Controller  | Coordinates between Artist, Librarian, and Curator                             |
| Doorman     | Authorizes users, directs them to their gallery                                |
| Postman     | Sends images to other users                                                    |