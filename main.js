//抓qeselector
let disItem  = document.querySelectorAll('.dis');
let maskItem =document.querySelectorAll('.msk');
let disDrop = document.getElementById('distext');
let mskDrop = document.getElementById('msktext');
let weekDay = document.getElementById('weekday');
let watchDay = document.getElementById('watchday');
let updateDom = document.getElementById('updatetime');
let storeList = document.querySelector('.sidebar__content__list');
let loading = document.querySelector('.loading');
let searchTxt = document.querySelector('.search__input');
let searchBtn =document.querySelector('.fa-search');
//增加監聽事件
disItem.forEach(function(item){
  item.addEventListener('click',function(){
    
    disItem.forEach(function(e){
      e.className = 'dropdown__item dis'
    })

    if (this.classList) {
      this.classList.toggle("active");
    }
    disDrop.textContent = this.textContent;
  })
})

maskItem.forEach(function(item){
  item.addEventListener('click',function(){
    
    maskItem.forEach(function(e){
      e.className = 'dropdown__item msk'
    })
    if (this.classList) {
      this.classList.toggle("active");
    }
    mskDrop.textContent = this.textContent;
  })
})

searchBtn.addEventListener('click',function(){
  makeSearchrequest(searchTxt.value)
})

storeList.addEventListener('click',function(e){
  let li = e.path.reverse()[8]
  map.setView([li.dataset.lat * 1,li.dataset.lon * 1],24)
  console.log (map.openPopup)

},true)

//建立ajax function
function makeSearchrequest(val){
  let xhr = new XMLHttpRequest();
  xhr.open('GET','https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json');
  xhr.send();
  xhr.onreadystatechange = function(){
    
    loading.style.opacity='1';
    loading.style.visibility='visible';
    if(this.readyState !== 4)return;
    let res = JSON.parse(this.responseText);
    let data = res.features;
    let storeAll = '';
    let dataUpdate = '';
  
    let filt = data.filter((item)=>{
      return item.properties.address.indexOf(val) !== -1
    })
    

    for (let i = 0 ; i < filt.length; i ++){
      let storeName = filt[i].properties.name;
      let storePhone = filt[i].properties.phone;
      let storeAddress = filt[i].properties.address;
      let storeMaskAd = filt[i].properties.mask_adult;
      let storeMaskCd = filt[i].properties.mask_child;
      let storeUpdate = filt[i].properties.updated;
      let storenote = filt[i].properties.note;
      let storelat = data[i].geometry.coordinates[1];
      let storelong = data[i].geometry.coordinates[0];
  
      let storeLi =`
      <li class='sidebar__content__item' data-lat='${storelat}' data-lon='${storelong}'>
        <h3 class='sidebar__content__item-title'>${storeName}</h3>
        <div class="sidebar__content__info">
          <i class="fas fa-map-marker-alt"></i>
          <p>${storeAddress}</p>
        </div>
        <div class="sidebar__content__info">
          <i class="fas fa-phone-alt"></i>
          <p>${storePhone}</p>
        </div>
        <div class="sidebar__content__info">
          <i class="far fa-clock"></i>
          <p>${storenote}</p>
        </div>
        <div class="sidebar__content__btnbox">
          <a href="#" class='sidebar__content__btn-ad'>
            成人口罩:<span>${storeMaskAd}</span>
          </a>
          <a href="#" class='sidebar__content__btn-cd'>
            兒童口罩:<span>${storeMaskCd}</span>
          </a>
        </div>
      </li>
      `
      storeAll += storeLi;
      
      if(dataUpdate === ''){
        dataUpdate = storeUpdate
      }
    }
    updateDom.innerHTML = dataUpdate 
    storeList.innerHTML = storeAll
    loading.style.opacity='0';
    loading.style.visibility='hidden';
  
  }
}

function makeAllrequest(){
  let xhr = new XMLHttpRequest();
xhr.open('GET','https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json');
xhr.send();
xhr.onreadystatechange = function(){
  
  loading.style.opacity='1';
  loading.style.visibility='visible';

  if(this.readyState !== 4)return;
  let res = JSON.parse(this.responseText);
  let data = res.features;
  let storeAll = '';
  let dataUpdate = '';
  console.log(data)
  for (let i = 0 ; i < data.length; i ++){
    let storeName = data[i].properties.name;
    let storePhone = data[i].properties.phone;
    let storeAddress = data[i].properties.address;
    let storeMaskAd = data[i].properties.mask_adult;
    let storeMaskCd = data[i].properties.mask_child;
    let storeUpdate = data[i].properties.updated;
    let storenote = data[i].properties.note;
    let storeGeo = data[i].geometry.coordinates.reverse();
    let storelat = data[i].geometry.coordinates[0];
    let storelong = data[i].geometry.coordinates[1];
    let mask = '';
    if(storeMaskAd > 2000){
      mask = greenIcon ;
    }else if(storeMaskAd <= 2000 && storeMaskAd > 1000){
      mask = orangeIcon ;
    }else{
      mask = redIcon ; 
    }

    markers.addLayer(L.marker(storeGeo,{icon : mask})
    .bindPopup(`
    <h2>${storeName}</h1>
    <p>電話:${storePhone}</p>
    <p>成人口罩:${storeMaskAd}</p>
    <p>兒童口罩:${storeMaskCd}</p>
    `));
    
    let storeLi =`
    <li class='sidebar__content__item' data-lat='${storelat}' data-lon='${storelong}'>
      <h3 class='sidebar__content__item-title'>${storeName}</h3>
      <div class="sidebar__content__info">
        <i class="fas fa-map-marker-alt"></i>
        <p>${storeAddress}</p>
      </div>
      <div class="sidebar__content__info">
        <i class="fas fa-phone-alt"></i>
        <p>${storePhone}</p>
      </div>
      <div class="sidebar__content__info">
        <i class="far fa-clock"></i>
        <p>${storenote}</p>
      </div>
      <div class="sidebar__content__btnbox">
        <a href="#" class='sidebar__content__btn-ad'>
          成人口罩:<span>${storeMaskAd}</span>
        </a>
        <a href="#" class='sidebar__content__btn-cd'>
          兒童口罩:<span>${storeMaskCd}</span>
        </a>
      </div>
    </li>
    `
    storeAll += storeLi;
    
    if(dataUpdate === ''){
      dataUpdate = storeUpdate
    }
  }
  
  updateDom.innerHTML = dataUpdate 
  storeList.innerHTML = storeAll
  loading.style.opacity='0';
  loading.style.visibility='hidden';
  map.addLayer(markers);

}
}

//抓時間 看是奇數還偶數
let currentDate = new Date();
let week = currentDate.getDay();
var dayList = ['日', '一', '二', '三', '四', '五', '六'];

if ((week %2)===0){
  watchDay.innerHTML = '偶數'
}else{
  watchDay.innerHTML = '奇數'
}

weekDay.innerHTML = dayList[week]


//find you position

navigator.geolocation.getCurrentPosition(function(position) {
  console.log(position.coords.latitude,position.coords.longitude)
});

//建立圖資最初的座標
let map = L.map('map', {
  center:[25.040741099999998,121.54840689999999],
  zoom: 16
});


//建立icon

let greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

let redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

let orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

//建立basic layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//建立makergroup圖層
let markers = new L.MarkerClusterGroup().addTo(map);

//make xml request
makeAllrequest()

