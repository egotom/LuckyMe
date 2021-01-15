<script>
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import Ticket from './component/ticket.svelte';
let show=[], luckMe=[], lst=[], serial=[], me=[], all=0;
let  modal=false, confirm=false;
let lb="B", error="", dell="";
let soltMax=1;
let luckMax=5;
let ts=null;
const LM = writable(JSON.parse(localStorage.getItem("luckMe"))||[]);
LM.subscribe(value => {luckMe = value;});

function Init(){
	show=[];
	for(let i=0;i<luckMax ;i++){
		show.push({"dpt":"","name":"","desc":"","ts":"","no":"","green":true});
	}
}

function Pause(){
	//console.log('--------------***********----------------');
	window.clearTimeout(ts);
	ts=null;
}

function Start(){
	if(all-luckMe.length-luckMax<0){
		window.clearTimeout(ts);
		ts=null;
		alert("剩余奖券不足！");
	}
	show=[];
	let si=[];
	ts=window.setTimeout(Start,20);
	for(let i=0 ; i<luckMax;){
		let n1=lb+'-'+Math.floor(Math.random()*soltMax);
		
		//if(luckMe.indexOf(n1)>-1 || lst.indexOf(n1)==-1 || si.indexOf(n1)>-1)
		if(luckMe.indexOf(n1)>-1 || si.indexOf(n1)>-1 || serial.indexOf(n1)==-1)
			continue
		
		let n2=lst.filter(it=>it[0]===n1)[0]
		//console.log( JSON.stringify(n2) );
		if(n2==null)
			continue
		show.push({"dpt":n2[1] ,"name":n2[2] ,"desc":n2[3] ,"ts":n2[4] ,"no":n2[0],"green":false})		
		si.push(n1)
		i++
	}
	document.querySelector("#stoprun").focus();
}

function AddLuck(lkm){	
	for(let i in show){
		if(show[i].no==lkm.no)
			show[i].green=true
	}
	modal=!modal
	me=lkm
	luckMe=[lkm.no, ...luckMe]
	localStorage.setItem("luckMe",JSON.stringify(luckMe))
}


function doModal(v){
	modal=!modal;
	if(typeof v=="string"){
		//console.log(v);
		me=null;
		for(let i in lst){
			if(v==lst[i][0]){
				me={"dpt":lst[i][2] ,"name":lst[i][3] ,"desc":lst[i][4] ,"ts":lst[i][5] ,"no":lst[i][0]};
				break;
			}
		}
	}
}

onMount(async () => {
	const res = await fetch(`http://120.26.118.222:5000/rflyts/6`);
	let lty = await res.json();
	soltMax=lty.sn+1;
	lb=lty.lst[0][0].split('-')[0];
	lst=lty.lst;
	all=lty.lst.length;
	Init();
	//console.log(JSON.stringify(lst.slice(0,30)));
	//console.log(lb,all,typeof soltMax)
	lty.lst.map(it=>serial.push(it[0]))
});

let key;
let keyCode;

function handleKeydown(event) {
	key = event.key;
	keyCode = event.keyCode;
	//console.log(keyCode);
	if(keyCode===13){
		//window.clearTimeout(ts);
		//ts=null;		
		Pause();		
	}
}


</script>

<svelte:window on:keydown={handleKeydown}/>
<main>
	{#if modal}
	<div class="backdrop">
		<div class="back">
			<div class="modal" on:click={doModal}>
				<div class="info">
					<p class="who">{me.dpt} - {me.name}</p>
					<p class="sel">{me.no}</p>
					<p class="why">{me.desc}</p>
					<p class="when">{me.ts}</p>
				</div>
			</div>
		</div>
	</div>
	{/if}
	<div class="dash">
		<div>
			<span class="label">获奖人数：</span><input type="number" on:keyup={Init} bind:value={luckMax} id="luckMax" class="w70">
			<br/>
			<button on:click={Start} >开 始</button>
			<br/>
			<button on:click={Pause} id="stoprun">停 止</button>
			
			<ul class="luckMe">
				<p><b style="color:red">已中奖序列号：</b></p>
				{#each luckMe as lm}
					<li><b on:click={()=>doModal(lm)}>{lm}</b></li>
				{/each}
			</ul>
			<div class="open">
				<a href="https://github.com/egotom/LuckyMe/tree/idiot" target="_blank">开放源代码: https://github.com/egotom/LuckyMe</a>
			</div>			
		</div>		
		<div>
			<div class="bod">
			{#each show as lk}
				<div><Ticket tick={lk} addOne={AddLuck}/> </div>
			{/each}
			</div>
		</div>
		
	</div>
</main>
<style>
	.dash{
		display: grid;
		grid-template-columns: 1fr 7fr;
	}
	.w70{max-width: 70px;}
	.label{
		font-size: 20px;
		font-weight: bold;
		color: rgb(0,0,255);
	}
	.bod{
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.open{
		margin-top: 20px;
		height:30px;
    	position: fixed;
    	bottom:10px;
	}

	.backdrop{
		width: 100%;
		height: 100%;
		position: fixed;
		background: rgb(0,0,0,0.8);
	}
	.back{
		border-radius: 5px;
		width: 952px;
		height: 400px;
		margin:5% auto;
		background-color: white;
	}

	.modal{
		border-radius: 5px;
		width: 952px;
		height: 400px;
		background-image:url("/red.jpg");
		background-size: cover;
		filter:alpha(opacity=60);

	}
	.info p{
		color:#222;
		font-size: 40px;
		font-weight: bold;
	}
	.who{
		margin-left: 30px;
		margin-top: 30px;
		display: inline-block;
		margin-bottom: 0;
	}
	.sel{
		float:right;
		margin-top: 30px;
		margin-right: 30px;
		display: inline-block;
		margin-bottom: 0;
	}
	.why{
		text-indent:2em;
		margin-top: 20px;
	}
	.when{
		float:right;
		margin-top: 30px;
		margin-right: 30px;
		margin-bottom: 30;
	}
	.luckMe{
		list-style: none;
		border: 1px solid red;
		padding: 10px;
		margin: 0;
	}
	.luckMe li b{
		color: rgb(255,0,0);
		font-size: 20px;
		font-weight: bold;
		text-decoration: none;
	}
	.luckMe li b:hover{
		text-decoration: underline;
		cursor:pointer;
	}
	button:hover{cursor:pointer;}
</style>