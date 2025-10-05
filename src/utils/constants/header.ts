import { Dialog } from "@angular/cdk/dialog";
import { RoutesType } from "src/app/core/types/general";
import { PagePipe } from "../pipes/page";
import { ModalNewBill } from "src/app/components/modal/new-bill/new-bill.modal";
import { ModalNewBank } from "src/app/components/modal/new-bank/new-bank.modal";
import { ModalNewCreditCard } from "src/app/components/modal/new-credit-card/new-credit-card.modal";
import { ModalNewCompany } from "src/app/components/modal/new-company/new-company.modal";
import { ModalNewCategory } from "src/app/components/modal/new-category/new-category.modal";

export const headerActions = (page: RoutesType, dialog: Dialog) => {
    const pagePipe = new PagePipe();

    let options = {
        data: {
            header: `new ${pagePipe.transform(page)}`,
            size: "md",
        },
        hasBackdrop: true,
        backdropClass: "modal-backdrop",
    };

    switch (page) {
        case "/bills":
            return [dialog.open(ModalNewBill, options)];
        case "/banks":
            return [dialog.open(ModalNewBank, options)];
        case "/credit-cards":
            return [dialog.open(ModalNewCreditCard, options)];
        case "/companies":
            return [dialog.open(ModalNewCompany, options)];
        case "/categories":
            return [dialog.open(ModalNewCategory, options)];
        default:
            return;
    }
};
