import { useObservable } from "rxjs-hooks";
import TaxonomyModel from "./TaxonomyModel";
import TaxonomyView from "./TaxonomyView";

const model = TaxonomyModel();

export default function TaxonomyController() {
    const taxonomy = useObservable(() => model.taxonomy$);

    if (!taxonomy) {
        return (<>Loading...</>);
    }
    return (
        <TaxonomyView taxonomy={taxonomy}
            navigateToRoot={model.navigateToRoot}
            navigateToWord={model.navigateToWord}
            navigateToSearch={model.navigateToSearch}
            generateWords={model.generateWords}
            generateRelations={model.generateRelations}
            regenerateGraph={model.regenerateGraph}/>
    );
}
