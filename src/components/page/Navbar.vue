<template>
    <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
    >
        <v-list
            nav
            dense
        >
            <v-list-item-group
                v-model="group"
                active-class="deep-purple--text text--accent-4"
            >
            <v-list-item>
                <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Home</v-list-item-title>
            </v-list-item>

            <v-list-item>
                <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Account</v-list-item-title>
            </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import EventBus from '../../EventBus';

export default {
    name: 'Navbar',
    data: () => ({
        drawer: false,
        group: null
    }),
    created() {
        EventBus.$on('toggleMenu', (loadData) => {
            console.log(loadData);
            this.drawer = loadData.drawer;
            this.group = loadData.group;
        });
    },
    beforeDestroy() {
        EventBus.$off('toggleMenu');
    }
}
</script>

<style lang="scss" scoped>
</style>
