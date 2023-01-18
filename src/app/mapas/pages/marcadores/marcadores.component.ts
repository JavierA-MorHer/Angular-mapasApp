import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorCustom{
  color:string;
  marker?: mapboxgl.Marker;
  centro?: [number, number]
  
}


@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
   .mapa-container{
      width:100%;
      height:100%
    }

    .list-group{
      position:fixed;
      top: 20px;
      right:20px;
      z-index:99;
    }
    li{
      cursor:pointer;
    }
  `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!:ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel:number = 16;
  center:[number,number] = [ -101.64850734296516, 21.080627851415173 ];

  //Arreglo de marcadores
  marcadores: MarcadorCustom[]=[]


  constructor() { }


  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement  ,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.center,
      zoom: this.zoomLevel
    });

   this.leerLS()

    //Agregar marcadores personalizados

    // const markerHTML: HTMLElement = document.createElement('div')
    // markerHTML.innerHTML='Hola mundo'
    
    // const marker = new mapboxgl.Marker({
    //   element: markerHTML
    // })
    //   .setLngLat( this.center )
    //   .addTo( this.mapa );

  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarker = new mapboxgl.Marker({
      draggable:true,
      color
    })
      .setLngLat( this.center )
      .addTo( this.mapa )

      this.marcadores.push({
        color,
        marker: nuevoMarker
      });

      this.guardarMarcadoresLS();

      nuevoMarker.on('dragend', ()=>{
        this.guardarMarcadoresLS();
      })

  }

  irMarcador( marker:mapboxgl.Marker ){
    this.mapa.flyTo({
      center: marker.getLngLat()
    })
  }

  guardarMarcadoresLS(){

    const lngLatArr:MarcadorCustom[] = []

    this.marcadores.forEach( m => {
       const color = m.color;
       const { lng, lat } = m.marker!.getLngLat();

       lngLatArr.push({
        color:color,
        centro:[lng,lat]
       })

       localStorage.setItem('marcadores', JSON.stringify(lngLatArr) )


    })

  }

  leerLS(){

    if( !localStorage.getItem('marcadores') ){
      return;
    }

    const lgnLatArr :MarcadorCustom[] = JSON.parse( localStorage.getItem('marcadores')! );

    
    lgnLatArr.forEach( m=>{

      const newMarker = new mapboxgl.Marker({
        color:m.color,
        draggable:true
      }).setLngLat( m.centro! )
      .addTo( this.mapa);


      this.marcadores.push({
        marker:newMarker,
        color:m.color
      })

      //Listener para ir guardando el centro cada que se mueve
      newMarker.on('dragend', ()=>{
        this.guardarMarcadoresLS();
      })
    })

  }

  borrarMarcador( i:number ){
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i,1)
    this.guardarMarcadoresLS();
  }
  

}
