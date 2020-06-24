<script>
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import Ticket from './component/ticket.svelte';
let s=[], luckMe=[], lst, me=[],code=33333, all=[];
let  modal=false, confirm=false;
let lb="B", error="", dell="";
let soltMax=1;
let luckMax=5;
let ts=null;
const LM = writable(JSON.parse(localStorage.getItem("luckMe"))|| []);
const unsubscribe= LM.subscribe(value => {
	luckMe = value;
});

function Init(){
	s=[];
	for(let i=0;i<luckMax ;i++){
		let col=[];
		for(let j=0;j<soltMax;j++){
			col.push(0);
		}
		s.push({"dpt":"","name":"","desc":"","ts":"","no":"","green":true});
	}
}

function Pause(){
	window.clearTimeout(ts);
	ts=null;
}

function Start(){
	s=[];
	ts=window.setTimeout(Start,2);
	for(let i=0 ; i<luckMax ;){
		let n1="";
		for(let j=0; j<soltMax; j++){
			let number=Math.floor(Math.random()*10);
			n1+=number.toString();
		}
		if(luckMe.indexOf(n1)>-1 || all.indexOf(n1)==-1)
			continue;
		let n2=null;
		for(let d in lst){
			if(lst[d][6]==n1){
				n2={"dpt":lst[d][2] ,"name":lst[d][3] ,"desc":lst[d][4] ,"ts":lst[d][5] ,"no":lst[d][0],"green":false}
				break;
			}
		}
		if(n2==null)
			continue;
		s.push(n2);
		i++;
	}
}

function AddLuck(lkm){	
	for(let i in s){
		if(s[i].no==lkm.no)
			s[i].green=true;
	}
	modal=!modal;
	me=lkm;
	luckMe=[lkm.no, ...luckMe];
	LM.subscribe(localStorage.setItem("luckMe",JSON.stringify(luckMe)));
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
	const res = await fetch(`http://120.26.118.222:5000/rflyts/4`);
	let lty = await res.json();
	soltMax=lty.sn;
	lb=lty.cpt;
	lst=lty.lst;
	Init();
	//console.log(JSON.stringify(lst));
	lty.lst.map(l=>{
		all.push(l[6]);
	})
	//console.log(JSON.stringify(all));
});

</script>
<main>
	{#if modal}
	<div class="backdrop">
		<div class="back">
			<div class="modal" on:click={doModal}>
				<div class="info">
					<p class="who">{me.dpt} - {me.name}</p>
					<p class="sel">{lb}-{me.no}</p>
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
			<button on:click={Start}>开 始</button>
			<br/>
			<button on:click={Pause}>停 止</button>
			
			<ul class="luckMe">
				<p><b style="color:red">已中奖序列号：</b></p>
				{#each luckMe as lm}
					<li><b on:click={()=>doModal(lm)}>{lb}-{lm}</b></li>
				{/each}
			</ul>
			<div class="open">
				<a href="https://github.com/egotom/LuckyMe/tree/idiot" target="_blank">开放源代码: https://github.com/egotom/LuckyMe</a>
			</div>			
		</div>		
		<div>
			<div class="bod">
			{#each s as lk}
				<div><Ticket tick={lk} addOne={AddLuck} cpt={lb}/> </div>
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
</style>