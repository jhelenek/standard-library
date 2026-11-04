import * as React from "react";
import { PuckComponent, Slot } from "@puckeditor/core";
import { cva } from "class-variance-authority";
import {
  backgroundColors,
  ThemeOptions,
  getAnalyticsScopeHash,
  msg,
  themeManagerCn,
  toPuckFields,
  YextComponentConfig,
  YextFields,
  SectionConfig,
} from "@yext/visual-editor";
import { PageSection } from "../shared/sectionSupport/atoms/pageSection.tsx";
import { VisibilityWrapper } from "../shared/sectionSupport/atoms/visibilityWrapper.tsx";
import {
  layoutProps,
  layoutVariants,
} from "../shared/sectionSupport/Layout.tsx";
import { AnalyticsScopeProvider } from "@yext/pages-components";

export const gridAllowedComponents = [
  "Address",
  "BodyText",
  "CTAGroup",
  "CTAWrapper",
  "Emails",
  "GetDirections",
  "HeadingText",
  "HoursTable",
  "HoursStatus",
  "ImageWrapper",
  "MapboxStaticMap",
  "Phone",
  "TextList",
  "Text",
];

const gridVariants = cva("grid w-full gap-8 sm:grid-cols-1", {
  variants: {
    columns: {
      1: "md:grid-cols-1 lg:grid-cols-1",
      2: "md:grid-cols-2 lg:grid-cols-2",
      3: "md:grid-cols-2 lg:grid-cols-3",
      4: "md:grid-cols-2 lg:grid-cols-4",
      5: "md:grid-cols-2 lg:grid-cols-5",
      6: "md:grid-cols-2 lg:grid-cols-6",
    },
  },
});

export interface GridProps extends layoutProps {
  columns: 1 | 2 | 3 | 4 | 5 | 6;
  slots: { Column: Slot }[];
  liveVisibility: boolean;
  className?: string;
  /** Alignment saved before each column had its own setting. */
  align?: "left" | "center" | "right";
  alignColumn1?: "left" | "center" | "right";
  alignColumn2?: "left" | "center" | "right";
  alignColumn3?: "left" | "center" | "right";
  alignColumn4?: "left" | "center" | "right";
  alignColumn5?: "left" | "center" | "right";
  alignColumn6?: "left" | "center" | "right";
  /** @internal */
  analytics: {
    scope?: string;
  };
}

const GridSection = React.forwardRef<
  HTMLDivElement,
  Parameters<PuckComponent<GridProps>>[0]
>(
  (
    {
      className,
      columns = 2,
      backgroundColor,
      slots,
      align,
      alignColumn1,
      alignColumn2,
      alignColumn3,
      alignColumn4,
      alignColumn5,
      alignColumn6,
    },
    ref
  ) => {
    const columnAlignments = [
      alignColumn1,
      alignColumn2,
      alignColumn3,
      alignColumn4,
      alignColumn5,
      alignColumn6,
    ];

    return (
      <PageSection background={backgroundColor} className={className}>
        <div className={gridVariants({ columns })} ref={ref}>
          {slots.slice(0, columns).map(({ Column }, idx) => {
            const resolvedAlign = columnAlignments[idx] ?? align ?? "left";

            return (
              <Column
                key={idx}
                className={themeManagerCn(
                  layoutVariants({ gap: "4" }),
                  `flex flex-col max-w-full overflow-hidden`,
                  resolvedAlign === "left"
                    ? `md:items-start text-start`
                    : resolvedAlign === "right"
                      ? `md:items-end text-end`
                      : `md:items-center text-center`
                )}
                allow={gridAllowedComponents}
              />
            );
          })}
        </div>
      </PageSection>
    );
  }
);

GridSection.displayName = "GridSection";

const gridSectionFields: YextFields<GridProps> = {
  columns: {
    label: msg("fields.columns", "Columns"),
    type: "select",
    options: [
      { label: msg("fields.options.one", "One"), value: 1 },
      { label: msg("fields.options.two", "Two"), value: 2 },
      { label: msg("fields.options.three", "Three"), value: 3 },
      { label: msg("fields.options.four", "Four"), value: 4 },
      { label: msg("fields.options.five", "Five"), value: 5 },
      { label: msg("fields.options.six", "Six"), value: 6 },
    ],
  },
  slots: {
    type: "array",
    arrayFields: {
      Column: { type: "slot" },
    },
    visible: false,
  },
  backgroundColor: {
    type: "basicSelector",
    label: msg("fields.backgroundColor", "Background Color"),
    options: "BACKGROUND_COLOR",
  },
  alignColumn1: {
    label: msg("fields.alignContentColumn1", "Align Content Column 1"),
    type: "radio",
    options: ThemeOptions.ALIGNMENT,
  },
  alignColumn2: {
    label: msg("fields.alignContentColumn2", "Align Content Column 2"),
    type: "radio",
    options: ThemeOptions.ALIGNMENT,
  },
  alignColumn3: {
    label: msg("fields.alignContentColumn3", "Align Content Column 3"),
    type: "radio",
    options: ThemeOptions.ALIGNMENT,
  },
  alignColumn4: {
    label: msg("fields.alignContentColumn4", "Align Content Column 4"),
    type: "radio",
    options: ThemeOptions.ALIGNMENT,
  },
  alignColumn5: {
    label: msg("fields.alignContentColumn5", "Align Content Column 5"),
    type: "radio",
    options: ThemeOptions.ALIGNMENT,
  },
  alignColumn6: {
    label: msg("fields.alignContentColumn6", "Align Content Column 6"),
    type: "radio",
    options: ThemeOptions.ALIGNMENT,
  },
  analytics: {
    type: "object",
    label: msg("fields.analytics", "Analytics"),
    visible: false,
    objectFields: {
      scope: {
        label: msg("fields.scope", "Scope"),
        type: "text",
      },
    },
  },
  liveVisibility: {
    label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
    type: "radio",
    options: [
      { label: msg("fields.options.show", "Show"), value: true },
      { label: msg("fields.options.hide", "Hide"), value: false },
    ],
  },
};

const alignmentFields = [
  "alignColumn1",
  "alignColumn2",
  "alignColumn3",
  "alignColumn4",
  "alignColumn5",
  "alignColumn6",
] as const;

/**
 * The Grid Section component presents a series of columns into which a variety of smaller content blocks may be dragged, allowing for a higher degree of customization.
 */
export const Grid: YextComponentConfig<GridProps> = {
  label: msg("components.grid", "Grid"),
  fields: gridSectionFields,
  defaultProps: {
    columns: 2,
    slots: [{ Column: [] }, { Column: [] }],
    backgroundColor: backgroundColors.background1.value,
    liveVisibility: true,
    analytics: {
      scope: "gridSection",
    },
    alignColumn1: "left",
    alignColumn2: "left",
    alignColumn3: "left",
    alignColumn4: "left",
    alignColumn5: "left",
    alignColumn6: "left",
  },
  resolveFields: (data) => {
    const fields = { ...gridSectionFields };
    alignmentFields.slice(data.props.columns).forEach((field) => {
      delete fields[field];
    });
    return toPuckFields(fields);
  },
  resolveData: (data) => {
    let slots = data.props.slots;

    if (data.props.columns < data.props.slots.length) {
      slots = data.props.slots.slice(0, data.props.columns);
    }

    if (data.props.columns > data.props.slots.length) {
      slots = data.props.slots.concat(
        Array.from(
          { length: data.props.columns - data.props.slots.length },
          () => {
            return { Column: [] };
          }
        )
      );
    }

    return {
      ...data,
      props: {
        ...data.props,
        slots,
        alignColumn1: data.props.alignColumn1 ?? data.props.align ?? "left",
        alignColumn2: data.props.alignColumn2 ?? data.props.align ?? "left",
        alignColumn3: data.props.alignColumn3 ?? data.props.align ?? "left",
        alignColumn4: data.props.alignColumn4 ?? data.props.align ?? "left",
        alignColumn5: data.props.alignColumn5 ?? data.props.align ?? "left",
        alignColumn6: data.props.alignColumn6 ?? data.props.align ?? "left",
      },
    };
  },
  render: (props) => (
    <AnalyticsScopeProvider
      name={`${props.analytics?.scope ?? "gridSection"}${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.liveVisibility}
        isEditing={props.puck.isEditing}
        iconSize="md"
      >
        <GridSection {...props} />
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  ),
};

export const config: SectionConfig = {
  id: "Grid",
  displayName: "Grid",
  description: "Renders a grid for other Core Information atoms.",
  pageSetTypes: ["ENTITY"],
  category: "Core Information",
};
