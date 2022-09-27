import { environment } from "src/environments/environment";

export const species = 'dipper';
const apiKey = environment.photoKey;
const apiUrl = 'https://api.flickr.com/services/rest/';
const baseUrl = `${apiUrl}?api_key=${apiKey}&format=json&nojsoncallback=1&method=flickr.photos.`;
const flickrPhotoSearch = `${baseUrl}search&per_page=20&tags=`;
export const flickrUrl = `${flickrPhotoSearch}${encodeURIComponent(species)}&page=${1}`

export const photoUrlsArray = Array<{ url: string }>(
    { url: 'https://farm66.staticflickr.com/65535/52370492495_9143d838ec_z.jpg' },
    { url: 'https://farm66.staticflickr.com/65535/52370455555_e7d81245c1_z.jpg' },
    { url: 'https://farm66.staticflickr.com/65535/52365430181_de10631953_z.jpg' });

export const flickrResponse =
{
    "photos": {
        "page": 1,
        "pages": 126,
        "perpage": 20,
        "total": 2503,
        "photo": [
            {
                "id": "52370492495",
                "owner": "12240837@N08",
                "secret": "9143d838ec",
                "server": "65535",
                "farm": 66,
                "title": "Arctic Skua (stercorarius parasiticus)",
                "ispublic": 1,
                "isfriend": 0,
                "isfamily": 0
            },
            {
                "id": "52370455555",
                "owner": "12240837@N08",
                "secret": "e7d81245c1",
                "server": "65535",
                "farm": 66,
                "title": "Skua sp",
                "ispublic": 1,
                "isfriend": 0,
                "isfamily": 0
            },
            {
                "id": "52365430181",
                "owner": "12639178@N07",
                "secret": "de10631953",
                "server": "65535",
                "farm": 66,
                "title": "Schmarotzeraubmöwe",
                "ispublic": 1,
                "isfriend": 0,
                "isfamily": 0
            }
        ]
    }
}