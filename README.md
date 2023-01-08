# RINGO FES 2022 PHOTO GALLERY
https://www.ringofes.info/photo/2022/


## Install
```
$ npm ci
```


## Put image files
Create this directory & Put the image files.  
```
// thumbnail image
_src/images/day1_other_thumb/
_src/images/day2_other_thumb/
_src/images/day3_other_thumb/

// full size image
_pub/images/photographer_photo/001/   //orii
_pub/images/photographer_photo/002/   //tohr
_pub/images/photographer_photo/003/   //hira
_pub/images/photographer_photo/004/   //abek
_pub/images/photographer_photo/005/   //wata
_pub/images/photographer_photo/006/   //furu
_pub/images/photographer_photo/007/   //shim
_pub/images/photographer_photo/008/   //kawa
_pub/images/day1_other_photo/
_pub/images/day2_other_photo/
_pub/images/day3_other_photo/
```

### Naming convention
3-digit number + _ + photographer's ID.  
```
001_orii.jpg
```

### Photographer's ID.
```
orii  //折井康弘  
tohr  //みやちとーる（ステキ工房）  
hira  //平林岳志（grasshopper）  
abek  //katsunori abe  
wata  //渡邉和弘  
furu  //古厩志帆  
shim  //清水隆裕（HARVEST TIME）  
kawa  //河谷俊輔  
```

### Page the Photographer's select 
artist.json
```
[
  {
    "stage": "photographer",
    "order": "001",
    "name": "折井康弘",
    "file": [
      "001_orii.jpg",
      "002_orii.jpg",
      "003_orii.jpg"
    ]
  }
]
```
- stage  
"photographer"

- order  
Directory name within ```_pub/images/photographer_photo/```

- name  
photographer name

- file  
file name



## Compile
```
$ npx gulp build
```




## Local server start & Watch file(ejs/scss/js/img/csv)
```
$ npx gulp
```