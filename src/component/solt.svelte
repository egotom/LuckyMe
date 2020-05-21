<script>
	export let lk=[], lb="A";
</script>
<main>
	<div class="solt">
			<div class="label">{lb}</div>
	</div>
	{#each lk as nb}
		<div class="solt">
			<div class="fancy">{nb}</div>
		</div>
	{/each}
</main>
<style>
.solt{
	display: inline-block;
}
.fancy {
    width: 130px;
    line-height: 130px;
    text-align: center;
    font-size: 130px;
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
    font-family: 'Gravitas One', serif;
    border-left: 1px solid #999;
    display: inline-block;
    margin: 6px;
    background-color: #FF2229;
}
.label {
    width: 130px;
    line-height: 130px;
    text-align: center;
    font-size: 130px;
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
    font-family: 'Gravitas One', serif;
    border-left: 1px solid #999;
    display: inline-block;
    margin: 6px;
    background-color: #2229FF;
}

</style>