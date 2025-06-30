import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
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
  WarningOutlined,
} from "@ant-design/icons";
import "./EditableTable.css";

const EditableContext = React.createContext<FormInstance | null>(null);

interface Item {
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
  dataIndex: keyof Item;
  title: React.ReactNode;
  inputType: "number" | "text";
  record: Item;
  handleSave: (record: Item) => void;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editable,
  inputType,
  dataIndex,
  title,
  record,
  handleSave,
  children,
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
        rules={[{ required: false, message: `${title} é obrigatório.` }]}
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
                placeholder={`${title}`}
                controls={false}
              />
              <Button
                type="text"
                size="small"
                style={{
                  marginLeft: 8,
                  color: "#F5F5DC",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  const random = Math.floor(Math.random() * 20) + 1;
                  handleSave({ ...record, [dataIndex]: random });
                  form.setFieldsValue({ [dataIndex]: random });
                  setEditing(false);
                }}
                tabIndex={0}
                aria-label="Gerar iniciativa aleatória"
              >
                <Tooltip title="Iniciativa aleatória">
                  <FaDiceD20 />
                </Tooltip>
              </Button>
            </div>
          ) : (
            <InputNumber
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
              style={{ width: "100%" }}
              variant="borderless"
              placeholder={`${title}`}
              controls={false}
            />
          )
        ) : (
          <Input
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            variant="borderless"
            placeholder={`${title}`}
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

interface DataType {
  key: React.Key;
  initiative: number | null;
  name: string;
  healthy_points: number | null;
  armor_class: number | null;
}

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;

const EditableTable: React.FC = () => {
  const initialValues = [
    {
      key: "1",
      initiative: null,
      name: "",
      healthy_points: null,
      armor_class: null,
    },
    {
      key: "2",
      initiative: null,
      name: "",
      healthy_points: null,
      armor_class: null,
    },
    {
      key: "3",
      initiative: null,
      name: "",
      healthy_points: null,
      armor_class: null,
    },
    {
      key: "4",
      initiative: null,
      name: "",
      healthy_points: null,
      armor_class: null,
    },
    {
      key: "5",
      initiative: null,
      name: "",
      healthy_points: null,
      armor_class: null,
    },
  ];
  const [dataSource, setDataSource] = useState<DataType[]>(initialValues);
  const [count, setCount] = useState(6);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
    inputType?: "number" | "text";
  })[] = [
    {
      title: "Iniciativa",
      dataIndex: "initiative",
      width: "20%",
      editable: true,
      inputType: "number",
    },
    {
      title: "Nome",
      dataIndex: "name",
      editable: true,
      width: "50%",
      inputType: "text",
    },
    {
      title: "HP",
      dataIndex: "healthy_points",
      editable: true,
      width: "15%",
      inputType: "number",
    },
    {
      title: "AC",
      dataIndex: "armor_class",
      editable: true,
      width: "15%",
      inputType: "number",
    },
    {
      title: "Ações",
      dataIndex: "actions",
      render: (_: unknown, record: DataType) =>
        dataSource.length >= 1 ? (
          <div className="flex justify-center">
            <Tooltip title="Excluir linha">
              <Popconfirm
                icon={<WarningOutlined style={{ color: "#1C2B4A" }} />}
                title="Deseja realmente excluir?"
                okText="Sim"
                cancelText="Não"
                color="#F5F5DC"
                onConfirm={() => handleDelete(record.key)}
                okButtonProps={{ className: "popconfirm-ok-btn" }}
                cancelButtonProps={{ className: "popconfirm-cancel-btn" }}
              >
                <DeleteOutlined style={{ fontSize: 18 }} />
              </Popconfirm>
            </Tooltip>
          </div>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      initiative: null,
      name: "",
      healthy_points: null,
      armor_class: null,
    };
    setCount(count + 1);
    setDataSource([...dataSource, newData]);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const handleClear = () => {
    setDataSource(initialValues);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        inputType: col.inputType || "text",
        handleSave,
      }),
    };
  });

  return (
    <Form component={false}>
      <div
        style={{
          width: "100%",
          maxWidth: 1500,
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
        <Table<DataType>
          components={components}
          rowClassName={() => "editable-row"}
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
            display: "flex",
            justifyContent: "start",
          }}
        >
          <Button
            type="primary"
            size="large"
            ghost
            style={{ color: "#1B5E20", borderColor: "#1B5E20" }}
          >
            Próximo
          </Button>
          <Button
            size="large"
            ghost
            style={{ color: "#1c2b4a", borderColor: "#1c2b4a" }}
          >
            <Tooltip title="Organizar">
              <OrderedListOutlined />
            </Tooltip>
          </Button>
          <Button color="danger" variant="outlined" size="large" ghost>
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
        </Flex>
      </div>
    </Form>
  );
};

export default EditableTable;
