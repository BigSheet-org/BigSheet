# Transitions : 

## Utilisation

Ce dossier contient des transitions réutilisables. Pour les utiliser sur un composant, il suffit de l'envelopper entre 
des balises représentant le composant de la transition : 

```html
<MaTransition>
    <MonComposant/>
</MaTransition>
```

ATTENTION : Les composants insèrés dans les transitions doivent IMPERATIVEMENT être des composants avec une raçine unique !

Par exemple : 
 - Ceci fonctionnera
```html
<MaTransition>
    <h1>Hello World !</h1>   
</MaTransition>
```
 - Ceci ne fonctionnera pas : 
```html
<MaTransition>
    <h1>Hello World !</h1>   
    <h2>La transition ne fonctionnera pas !</h2>   
</MaTransition>
```

## Conception : 

Les transitions sont en réalité majoritairement définies dans les feuilles de style SCSS. Néanmoins, certaines 
dispositions sont à prendre lorsque vous créerez un composant.

Il faut que le composant de transition (et les composants qui lui sont données dans la balise ``<slot/>``) ne soient 
affichés que lorsqu'ils sont montés et démontés. Sinon l'animation de se fera pas.

C'est pourquoi, il est recommandé de reprendre la balise script suivante : 
```javascript
<script>
export default{
    // Allows us to tell VueJS when it needs to apply entering transitions or not
    data(){
        return{ show: false }
    },
    mounted() {
        this.show = true
    },
}
</script>
```

Elle permet simplement de définir l'attribut *show* lorsque le composant est complètement monté.

De plus, la balise template respecte la syntaxe suivante : 
````html
<template>
    <Transition name="une_transition">
        <slot v-if="show"/>   <!-- Passes down components inside the transitions -->
    </Transition>
</template>
````

Ainsi, le ``<slot v-if=show/>`` ne sera affiché que lorsque le composant ser complètement monté.

## Style : 

Vous avez sans doute remarqué que la transition possède un attribut ``name="une_transition``, mais à quoi sert-il ? 🤔
Cet élément permet de définir un style personnalisé à la transition dans les feuilles SCSS.

Les feuilles de style définissent les transitions comme suit : 

```scss

.une_transition-enter-active{}
.une_transition-leave-active {}
.une_transition-enter-from {}
.une_transition-leave-to {}  
.une_transition-enter-to{}
.une_transition-leave-from {}
```

Pour mieux comprendre, je vous demanderai de lire la documentation officielle VueJS. Mais, pour faire simple, les 
classes définies ci-dessus correspondent à des points clés de l'animation.

Pour le reste, c'est du CSS ! Youpi ! 😁
Vous pouvez vous inspirer des méthodes utilisées dans la feuille de style **transitions.scss**.

