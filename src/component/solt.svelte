<script>
	export let lk=[], lb="A", miss=true, addOne;
</script>
<main>
	<div class="solt">
		<div class="label" on:click={()=>addOne(lk)}>{lb}</div>
	</div>
	{#each lk as nb}
		<div class="solt" >
			<div class="fancy" class:fld={miss}>{nb}</div>
		</div>
	{/each}
</main>
<style>
.solt{
	display: inline-block;
}
.fancy, .label {
    width: 130px;
    line-height: 130px;
    text-align: center;
    font-size: 130px;
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
    font-family: 'Gravitas One', serif;
    border-left: 1px solid #999;
    border-radius: 6px;
    display: inline-block;
    margin: 6px;
    background-color: #FF2229;
}
.label {
    background-color: #0009FF;
}
.label:hover{
    background-color: #4449FF;
    cursor:pointer
}
.fld{
	background-color: #00A900;
}
</style>