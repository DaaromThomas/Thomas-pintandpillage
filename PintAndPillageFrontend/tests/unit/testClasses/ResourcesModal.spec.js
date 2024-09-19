import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";

import LevelUpBuilding from "@/components/ui/LevelUpBuilding.vue";
import ResourcesModal from "@/components/ui/modals/ResourcesModal.vue";


let resourcesModalWrapper;
let store;
let getters;
let localVue;

beforeAll(() => {
    localVue = createLocalVue();
    localVue.component("LevelUpBuilding", LevelUpBuilding);
    localVue.use(Vuex);
});

beforeEach(() => {
    getters = {
        building: () => () => {
            return require("../testdata/test_building_data.json");
        }
    }

    store = new Vuex.Store({
        getters
    })

    resourcesModalWrapper = shallowMount(ResourcesModal, {
        store,
        localVue
    })
})

afterAll(() => {
    resourcesModalWrapper.destroy();
})


describe("TestResourceModal", () => {
    it("shouldDisplayCorrectNameAndLevel", () => {
        const buildingName = store.getters.building().name;
        const buildingLevel = store.getters.building().level;

        const expected = buildingName + " - Lv " + buildingLevel;
        const actual = resourcesModalWrapper.find("h1").text();

        expect(actual).toBe(expected);
    })

    it("shouldDisplayCorrectResourceInfo", () => {
        const resourcesPerHour = store.getters.building().resourcesPerHour;
        const resourceType = store.getters.building().generatesResource;

        const expected = resourcesPerHour + " " + resourceType + " / Hour";
        const actual = resourcesModalWrapper.find("h2").text();

        expect(actual).toBe(expected);
    })
})
