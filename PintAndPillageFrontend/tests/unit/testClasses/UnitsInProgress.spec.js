import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import UnitsInProgress from "@/components/ui/barracks/UnitsInProgress.vue";
import unitTestData from "../testData/test_unit_in_progress_data.json"; // Adjust the path to your test data

let wrapper;
let store;
let getters;
let localVue;

const createStore = (building) => {
    getters = {
        building: () => (buildingId) => (buildingId === building.buildingId ? building : null),
    };

    return new Vuex.Store({ getters });
};

const createWrapper = (buildingId, title) => {
    return shallowMount(UnitsInProgress, {
        store,
        localVue,
        propsData: {
            properties: { buildingId, title },
        },
    });
};

beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
});

beforeEach(() => {
    const { building } = unitTestData;
    store = createStore(building);
    wrapper = createWrapper(building.buildingId, "Unit Queue");
});

afterEach(() => {
    wrapper.destroy();
});

describe("UnitsInProgress.vue", () => {
    it("shouldDisplayTheCorrectTitle", () => {
        const title = wrapper.find("h1").text();
        expect(title).toBe("Unit Queue");
    });

    it("shouldRenderTheCorrectNumberOfQueueItems", () => {
        const queueItems = wrapper.findAll(".queueItem");
        expect(queueItems.length).toBe(2);
    });

    it("shouldHighlightTheFirstItemInGreen", () => {
        const firstItemStyle = wrapper.find(".queueItem").attributes().style;
        expect(firstItemStyle).toContain("color: green");
    });

    it("shouldReturnTheCorrectBuildingDataFromVuex", () => {
        expect(wrapper.vm.building.buildingId).toBe(1);
    });

    it("shouldShowNoUnitsBeingTrainedRightNowWhenTheProductionQueueIsEmpty", async () => {
        // Mock store for an empty production queue
        const emptyBuilding = {
            buildingId: 2,
            productionQueue: [],
            unlockedUnitsData: [],
        };

        store = createStore(emptyBuilding);
        wrapper = createWrapper(2, "Empty Queue");

        const noUnitsText = wrapper.find(".no-unit-text");
        expect(noUnitsText.text()).toBe("No units being trained right now");
    });
});

