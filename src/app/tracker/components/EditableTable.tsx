import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { FaDiceD20 } from "react-icons/fa";
import type { FormInstance } from "antd/es/form";
import type { TableProps } from "antd/es/table";
import {
  ClearOutlined,
  DeleteOutlined,
  OrderedListOutlined,
  PlusCircleOutlined,
  SyncOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import "./EditableTable.css";

const EditableContext = React.createContext<FormInstance | null>(null);

interface TableRow {
  key: string;
  initiative: number | null;
  name: string;
  healthy_points: number | null;
  armor_class: number | null;
}

const EditableRow: React.FC = (props) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  editable: boolean;
  dataIndex: keyof TableRow;
  title: React.ReactNode;
  inputType: "number" | "text";
  record: TableRow;
  handleSave: (record: TableRow) => void;
  children: React.ReactNode;
  placeholder?: string;
}

const EditableCell: React.FC<
  EditableCellProps & { rowIndex: number; selectedRowIndex: number }
> = ({
  editable,
  inputType,
  dataIndex,
  title,
  record,
  handleSave,
  children,
  rowIndex,
  selectedRowIndex,
  placeholder,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(true);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      setEditing(false);
      handleSave({ ...record, ...values });
    } catch {
      setEditing(false);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: false,
            message: `${placeholder || title} é obrigatório.`,
          },
        ]}
      >
        {inputType === "number" ? (
          dataIndex === "initiative" ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <InputNumber
                ref={inputRef}
                onPressEnter={save}
                onBlur={save}
                style={{ width: "100%" }}
                variant="borderless"
                placeholder={
                  placeholder || (typeof title === "string" ? title : undefined)
                }
                controls={false}
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <Tooltip title="Iniciativa aleatória">
                <Button
                  type="text"
                  size="small"
                  style={{
                    marginLeft: 8,
                    display: "flex",
                    alignItems: "center",
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  icon={
                    <FaDiceD20
                      color={
                        rowIndex === selectedRowIndex ? "#1C2B4A" : "#F5F5DC"
                      }
                    />
                  }
                  onClick={() => {
                    const random = Math.floor(Math.random() * 20) + 1;
                    handleSave({ ...record, [dataIndex]: random });
                    form.setFieldsValue({ [dataIndex]: random });
                    setEditing(false);
                  }}
                  tabIndex={0}
                  aria-label="Gerar iniciativa aleatória"
                ></Button>
              </Tooltip>
            </div>
          ) : (
            <InputNumber
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
              style={{ width: "100%" }}
              variant="borderless"
              placeholder={
                placeholder || (typeof title === "string" ? title : undefined)
              }
              controls={false}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          )
        ) : (
          <Input
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            variant="borderless"
            placeholder={
              placeholder || (typeof title === "string" ? title : undefined)
            }
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24, minHeight: 32, cursor: "pointer" }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type ColumnTypes = Exclude<TableProps<TableRow>["columns"], undefined>;

const EditableTable: React.FC = () => {
  const INITIAL_ROWS = 5;
  const initialValues = generateInitialValues(INITIAL_ROWS);
  const [dataSource, setDataSource] = useState<TableRow[]>(initialValues);
  const [count, setCount] = useState(INITIAL_ROWS + 1);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [roundCount, setRoundCount] = useState(1);
  const [resetAnim, setResetAnim] = useState(false);

  useEffect(() => {
    setSelectedRowIndex(0);
  }, [dataSource.length]);

  const handleDelete = (key: string) => {
    setDataSource((prev) => prev.filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    const newData: TableRow = {
      key: count.toString(),
      initiative: null,
      name: "",
      healthy_points: null,
      armor_class: null,
    };
    setCount((c) => c + 1);
    setDataSource((prev) => [...prev, newData]);
  };

  const handleSave = (row: TableRow) => {
    setDataSource((prev) => {
      const newData = [...prev];
      const index = newData.findIndex((item) => row.key === item.key);
      if (index > -1) {
        newData.splice(index, 1, { ...newData[index], ...row });
      }
      return newData;
    });
  };

  const handleClear = () => {
    setDataSource(initialValues);
    setSelectedRowIndex(0);
    setRoundCount(1);
  };

  const handleOrder = () => {
    setDataSource((prev) =>
      [...prev].sort(
        (a, b) => (b.initiative ?? -Infinity) - (a.initiative ?? -Infinity)
      )
    );
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
    inputType?: "number" | "text";
    placeholder?: string;
  })[] = [
    {
      title: <span className="logo-font">Iniciativa</span>,
      dataIndex: "initiative",
      width: "20%",
      editable: true,
      inputType: "number",
      placeholder: "Iniciativa",
    },
    {
      title: <span className="logo-font">Nome</span>,
      dataIndex: "name",
      editable: true,
      width: "50%",
      inputType: "text",
      placeholder: "Nome",
    },
    {
      title: <span className="logo-font">HP</span>,
      dataIndex: "healthy_points",
      editable: true,
      width: "15%",
      inputType: "number",
      placeholder: "HP",
    },
    {
      title: <span className="logo-font">AC</span>,
      dataIndex: "armor_class",
      editable: true,
      width: "15%",
      inputType: "number",
      placeholder: "AC",
    },
    {
      title: <span className="logo-font">Ações</span>,
      dataIndex: "actions",
      render: (_: unknown, record: TableRow, rowIndex: number) =>
        dataSource.length >= 1 ? (
          <div className="flex justify-center">
            <Tooltip title="Excluir linha">
              <Popconfirm
                icon={<WarningOutlined style={{ color: "#1C2B4A" }} />}
                title="Deseja realmente excluir?"
                okText="Sim"
                cancelText="Não"
                onConfirm={() => handleDelete(record.key)}
                okButtonProps={{ className: "popconfirm-ok-btn" }}
                cancelButtonProps={{ className: "popconfirm-cancel-btn" }}
              >
                <DeleteOutlined
                  style={{
                    fontSize: 18,
                    color: rowIndex === selectedRowIndex ? "#1C2B4A" : "red",
                  }}
                />
              </Popconfirm>
            </Tooltip>
          </div>
        ) : null,
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TableRow, rowIndex: number) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        inputType: col.inputType || "text",
        handleSave,
        rowIndex,
        selectedRowIndex,
        placeholder: col.placeholder,
      }),
    };
  });

  return (
    <Form component={false}>
      <div
        style={{
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div className="flex justify-end">
          <Tooltip title="Criar uma nova linha">
            <Button
              onClick={handleAdd}
              type="text"
              size="large"
              className="custom-add-btn"
              style={{
                marginBottom: 16,
                borderColor: "#1C2B4A",
                borderRadius: 12,
                padding: "0 24px",
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlusCircleOutlined style={{ color: "#1C2B4A" }} />
            </Button>
          </Tooltip>
        </div>
        <Table<TableRow>
          components={components}
          rowClassName={(_, index) =>
            index === selectedRowIndex
              ? "editable-row selected-row"
              : "editable-row"
          }
          bordered
          dataSource={dataSource}
          columns={columns as ColumnTypes}
          pagination={false}
          style={{
            background: "#F5F5DC",
            borderRadius: 8,
            border: "2px solid #1C2B4A",
          }}
          summary={() => null}
          className="custom-table-colors"
        />
        <Flex
          gap="small"
          wrap
          style={{
            marginTop: 25,
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className="flex justify-between gap-2">
            <Button
              className="logo-font"
              type="primary"
              size="large"
              ghost
              style={{ color: "#1B5E20", borderColor: "#1B5E20" }}
              onClick={() => {
                if (dataSource.length === 0) {
                  setSelectedRowIndex(0);
                  return;
                }
                const nextIndex = (selectedRowIndex + 1) % dataSource.length;
                if (nextIndex === 0) {
                  setRoundCount((rc) => rc + 1);
                }
                setSelectedRowIndex(nextIndex);
              }}
            >
              Próximo
            </Button>
            <Tooltip title="Organizar">
              <Button
                className="logo-font"
                size="large"
                ghost
                icon={<OrderedListOutlined />}
                style={{ color: "#1c2b4a", borderColor: "#1c2b4a" }}
                onClick={handleOrder}
              ></Button>
            </Tooltip>
            <Button
              color="danger"
              variant="outlined"
              size="large"
              ghost
              className="logo-font"
            >
              <Popconfirm
                icon={<WarningOutlined style={{ color: "#1C2B4A" }} />}
                title="Deseja realmente limpar tudo?"
                okText="Sim"
                cancelText="Não"
                color="#F5F5DC"
                onConfirm={handleClear}
                okButtonProps={{ className: "popconfirm-ok-btn" }}
                cancelButtonProps={{ className: "popconfirm-cancel-btn" }}
              >
                <Tooltip title="Limpar">
                  <ClearOutlined />
                </Tooltip>
              </Popconfirm>
            </Button>
          </div>
          <Tag
            className={`logo-font${resetAnim ? " round-reset-anim" : ""}`}
            style={{
              marginBottom: 10,
              height: 40,
              width: 135,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 20,
              backgroundColor: "#1C2B4A",
              color: "#F5F5DC",
              borderColor: resetAnim ? "#1B5E20" : "#1C2B4A",
              transition: "box-shadow 0.3s, border-color 0.3s",
              boxShadow: resetAnim ? "0 0 10px 2px #1C2B4A" : "none",
              borderRadius: 10,
            }}
          >
            Rodada {roundCount}
            <Tooltip title="Reiniciar rodadas">
              <SyncOutlined
                spin
                style={{ fontSize: 16 }}
                onClick={() => {
                  setRoundCount(1);
                  setResetAnim(true);
                  setTimeout(() => setResetAnim(false), 500);
                }}
              />
            </Tooltip>
          </Tag>
        </Flex>
      </div>
    </Form>
  );
};

const generateInitialValues = (count: number): TableRow[] =>
  Array.from({ length: count }, (_, i) => ({
    key: (i + 1).toString(),
    initiative: null,
    name: "",
    healthy_points: null,
    armor_class: null,
  }));

export default EditableTable;
