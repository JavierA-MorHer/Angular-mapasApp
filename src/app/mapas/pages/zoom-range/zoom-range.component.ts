import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
    .mapa-container{
      width:100%;
      height:100%
    }

    .row{
      background-color:white;
      border-radious:10px;
      position:fixed;
      bottom: 50px;
      left:50px;
      padding:10px;
      z-index:9999;
      width:400px
    }
  `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!:ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel:number = 16;
  center:[number,number] = [ -101.64850734296516, 21.080627851415173 ];

  constructor() {}
  ngOnDestroy(): void {
    this.mapa.off('zoom',()=>{})
    this.mapa.off('zoomend',()=>{})
    this.mapa.off('move',()=>{})
  }

  ngAfterViewInit(): void {
  
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement  ,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.center,
      zoom: this.zoomLevel
    });

    this.mapa.on('zoom',(e)=>{
      this.zoomLevel = this.mapa.getZoom()
    });

    this.mapa.on('zoomend',(e)=>{
      if( this.mapa.getZoom() > 18 ){
        this.mapa.zoomTo(18)
      }
    });

    //Obtener las coordenadas centrales del mapa cuando se mueve
    this.mapa.on('move', (event)=>{
      const target = event.target
      const {lng, lat} = target.getCenter();
      this.center = [ lng, lat ] 
    })

  }

  zoomIn(){
    this.mapa.zoomIn();

  }

  zoomOut(){
    this.mapa.zoomOut();
  }

  zoomCambio( valor:string ){
    this.mapa.zoomTo( Number(valor))
  }

}
